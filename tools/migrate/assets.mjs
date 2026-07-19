#!/usr/bin/env node
/**
 * Assets — build the DAM asset package for the migrated content.
 *
 * Scans JCR XML for source image URLs, writes an asset-mapping.json
 * (sourceUrl -> /content/dam/.../file), downloads the images, and wraps them as
 * dam:Asset FileVault nodes in an installable .zip. The mapping it writes is the
 * same file `package.mjs --asset-mapping` consumes to rewrite content refs.
 *
 * Usage:
 *   node tools/migrate/assets.mjs \
 *     --src tools/migrate/jcr-out/knee \
 *     --dam-root /content/dam/personalized-knee/knee \
 *     --mapping-out tools/migrate/asset-mapping.json \
 *     --out personalized-knee-assets.zip \
 *     [--skip-hosts placehold.co] [--concurrency 8]
 *
 * Re-runs are incremental: already-downloaded images are reused.
 */
import {
  readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync, statSync,
} from 'fs';
import { resolve, join, dirname, extname } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function parseArgs() {
  const a = process.argv.slice(2);
  const o = {
    damRoot: '/content/dam/personalized-knee/knee',
    mappingOut: 'tools/migrate/asset-mapping.json',
    concurrency: 8,
    skipHosts: ['placehold.co'],
  };
  for (let i = 0; i < a.length; i += 1) {
    const k = a[i];
    if (k === '--src') o.src = a[++i];
    else if (k === '--dam-root') o.damRoot = a[++i];
    else if (k === '--mapping-out') o.mappingOut = a[++i];
    else if (k === '--out') o.out = a[++i];
    else if (k === '--concurrency') o.concurrency = parseInt(a[++i], 10) || 8;
    else if (k === '--skip-hosts') o.skipHosts = a[++i].split(',');
    else { console.error(`Unknown arg: ${k}`); process.exit(1); }
  }
  if (!o.src || !o.out) {
    console.error('Usage: node tools/migrate/assets.mjs --src <jcrDir> --out <assets.zip> [--dam-root <path>] [--mapping-out <file>] [--skip-hosts a,b]');
    process.exit(1);
  }
  return o;
}

// Collect distinct image="..." URLs from all JCR XML in a directory.
function collectImageUrls(srcDir, skipHosts) {
  const urls = new Set();
  for (const f of readdirSync(srcDir).filter((x) => x.endsWith('.xml'))) {
    const xml = readFileSync(join(srcDir, f), 'utf-8');
    const re = /image="(https?:\/\/[^"]+)"/g;
    let m;
    while ((m = re.exec(xml)) !== null) {
      const u = m[1];
      if (skipHosts.some((h) => u.includes(h))) continue;
      urls.add(u);
    }
  }
  return [...urls].sort();
}

// Turn a source URL into a clean, unique DAM filename.
function damNameFor(url) {
  const { pathname } = new URL(url);
  let last;
  if (pathname.includes('/jcr:content/renditions')) {
    // .../<asset>.jpg/jcr:content/renditions/cq5dam... -> use the asset name
    last = decodeURIComponent(pathname.split('/jcr:content/')[0].replace(/\/$/, '').split('/').pop());
  } else {
    last = decodeURIComponent(pathname.replace(/\/$/, '').split('/').pop());
  }
  let name = last.toLowerCase()
    .replace(/-(jpg|jpeg|png|gif|webp)$/, '.$1');
  if (!/\.(jpg|jpeg|png|gif|webp)$/.test(name)) name += '.jpeg';
  name = name.replace(/[^a-z0-9._-]+/g, '-').replace(/-+/g, '-').replace(/^[-.]+|[-.]+$/g, '');
  return name;
}

function buildMapping(urls, damRoot) {
  const mapping = {};
  const used = new Set();
  for (const url of urls) {
    const base = damNameFor(url);
    const ext = extname(base);
    const stem = base.slice(0, -ext.length);
    let name = base;
    let c = 1;
    while (used.has(`${damRoot}/${name}`)) { c += 1; name = `${stem}-${c}${ext}`; }
    used.add(`${damRoot}/${name}`);
    mapping[url] = `${damRoot}/${name}`;
  }
  return mapping;
}

async function downloadAll(mapping, dlRoot, concurrency) {
  const entries = Object.entries(mapping);
  let ok = 0; let cached = 0; let fail = 0;
  const queue = [...entries];
  async function worker() {
    while (queue.length) {
      const [url, dam] = queue.shift();
      const rel = dam.replace('/content/dam/', '');
      const dest = join(dlRoot, rel);
      if (existsSync(dest) && statSync(dest).size > 0) { cached += 1; continue; }
      try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buf = Buffer.from(await res.arrayBuffer());
        if (buf.length < 100) throw new Error('too small');
        mkdirSync(dirname(dest), { recursive: true });
        writeFileSync(dest, buf);
        ok += 1;
      } catch (e) {
        fail += 1;
        console.error(`  ✗ ${url.slice(0, 70)}: ${e.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker));
  return { ok, cached, fail };
}

const ASSET_XML = (mime) => `<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:jcr="http://www.jcp.org/jcr/1.0" xmlns:nt="http://www.jcp.org/jcr/nt/1.0" xmlns:dam="http://www.day.com/dam/1.0" xmlns:dc="http://purl.org/dc/elements/1.1/"
    jcr:primaryType="dam:Asset">
  <jcr:content jcr:primaryType="dam:AssetContent">
    <metadata jcr:primaryType="nt:unstructured" dc:format="${mime}"/>
    <renditions jcr:primaryType="nt:folder"/>
  </jcr:content>
</jcr:root>
`;

const MIME = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif', webp: 'image/webp' };

const FILTER = (root) => `<?xml version="1.0" encoding="UTF-8"?>
<workspaceFilter version="1.0">
  <filter root="${root}"/>
</workspaceFilter>
`;
const PROPERTIES = (name) => `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE properties SYSTEM "http://java.sun.com/dtd/properties.dtd">
<properties>
  <comment>FileVault Package Definition</comment>
  <entry key="name">${name}</entry>
  <entry key="group">excat-migration</entry>
  <entry key="version">1.0</entry>
</properties>
`;

async function zipDir(stage, outZip) {
  try {
    const archiver = require('archiver');
    const { createWriteStream } = require('fs');
    await new Promise((res, rej) => {
      const output = createWriteStream(outZip);
      const archive = archiver('zip', { zlib: { level: 9 } });
      output.on('close', res);
      archive.on('error', rej);
      archive.pipe(output);
      archive.directory(stage, false);
      archive.finalize();
    });
    return;
  } catch { /* fall through */ }
  const { execFileSync } = require('child_process');
  try { execFileSync('zip', ['-qr', outZip, '.'], { cwd: stage }); return; } catch { /* fall through */ }
  execFileSync('python3', ['-c', `import zipfile,os,sys
stage,out=sys.argv[1],sys.argv[2]
z=zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)
for r,_,fs in os.walk(stage):
  for f in fs:
    p=os.path.join(r,f); z.write(p,os.path.relpath(p,stage))
z.close()`, stage, outZip]);
}

async function main() {
  const o = parseArgs();
  const srcDir = resolve(o.src);
  const dlRoot = resolve('tools/migrate/.assets-dl');
  const stage = resolve('tools/migrate/.assets-stage');

  const urls = collectImageUrls(srcDir, o.skipHosts);
  console.log(`Found ${urls.length} distinct image URL(s).`);

  const mapping = buildMapping(urls, o.damRoot);
  mkdirSync(dirname(resolve(o.mappingOut)), { recursive: true });
  writeFileSync(resolve(o.mappingOut), JSON.stringify(mapping, null, 2));
  console.log(`Wrote mapping -> ${o.mappingOut}`);

  const dl = await downloadAll(mapping, dlRoot, o.concurrency);
  console.log(`Downloaded ${dl.ok}, cached ${dl.cached}, failed ${dl.fail}.`);
  if (dl.fail) console.error('Some images failed to download; they will be missing from the package.');

  // Build dam:Asset FileVault nodes.
  if (existsSync(stage)) rmSync(stage, { recursive: true });
  mkdirSync(join(stage, 'META-INF', 'vault'), { recursive: true });
  let n = 0;
  for (const dam of Object.values(mapping)) {
    const rel = dam.replace('/content/dam/', '');
    const srcFile = join(dlRoot, rel);
    if (!existsSync(srcFile)) continue;
    const ext = extname(rel).slice(1).toLowerCase();
    const nodeDir = join(stage, 'jcr_root', 'content', 'dam', rel);
    const renDir = join(nodeDir, '_jcr_content', 'renditions');
    mkdirSync(renDir, { recursive: true });
    writeFileSync(join(nodeDir, '.content.xml'), ASSET_XML(MIME[ext] || 'image/jpeg'));
    writeFileSync(join(renDir, 'original'), readFileSync(srcFile));
    n += 1;
  }
  writeFileSync(join(stage, 'META-INF', 'vault', 'filter.xml'), FILTER(o.damRoot));
  writeFileSync(join(stage, 'META-INF', 'vault', 'properties.xml'), PROPERTIES('personalized-knee-assets'));

  await zipDir(stage, resolve(o.out));
  rmSync(stage, { recursive: true });
  console.log(`Packaged ${n} asset node(s) -> ${o.out}`);
  console.log(`\nNext: rewrite content refs with the mapping when packaging content:`);
  console.log(`  node tools/migrate/package.mjs --src ${o.src} --jcr-root /content/personalized-knee/knee --name personalized-knee-articles-dam --out personalized-knee-articles-dam-refs.zip --asset-mapping ${o.mappingOut}`);
}

main();
