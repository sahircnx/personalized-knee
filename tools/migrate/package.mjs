#!/usr/bin/env node
/**
 * Stage 4 — Package JCR XML into an AEM FileVault content package (.zip).
 *
 * Each <name>.xml becomes a page node:
 *   jcr_root/<jcrRoot>/<name>/.content.xml
 * plus META-INF/vault/{filter.xml,properties.xml}. Install via CRXDE Package
 * Manager (/crx/packmgr) or `aem-import-helper aem upload`.
 *
 * Usage:
 *   node tools/migrate/package.mjs \
 *     --src tools/migrate/jcr-out/knee \
 *     --jcr-root /content/personalized-knee/knee \
 *     --name personalized-knee-articles \
 *     --out personalized-knee-articles.zip \
 *     [--asset-mapping tools/migrate/asset-mapping.json]
 *
 * With --asset-mapping (a { "<sourceImageUrl>": "/content/dam/.../file.jpg" } map),
 * every matching image URL in the JCR is rewritten to the DAM path before packaging.
 */
import {
  readFileSync, writeFileSync, readdirSync, mkdirSync, rmSync, existsSync,
} from 'fs';
import { resolve, join } from 'path';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

function parseArgs() {
  const a = process.argv.slice(2);
  const o = {};
  for (let i = 0; i < a.length; i += 1) {
    const k = a[i];
    if (k === '--src') o.src = a[++i];
    else if (k === '--jcr-root') o.jcrRoot = a[++i];
    else if (k === '--name') o.name = a[++i];
    else if (k === '--out') o.out = a[++i];
    else if (k === '--asset-mapping') o.assetMapping = a[++i];
    else { console.error(`Unknown arg: ${k}`); process.exit(1); }
  }
  if (!o.src || !o.jcrRoot || !o.name || !o.out) {
    console.error('Usage: node tools/migrate/package.mjs --src <jcrDir> --jcr-root </content/...> --name <pkgName> --out <file.zip> [--asset-mapping <map.json>]');
    process.exit(1);
  }
  return o;
}

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

async function main() {
  const o = parseArgs();
  const src = resolve(o.src);
  const stage = resolve('tools/migrate/.pkg-stage');
  if (existsSync(stage)) rmSync(stage, { recursive: true });
  const nodeRoot = join(stage, 'jcr_root', o.jcrRoot.replace(/^\//, ''));
  mkdirSync(join(stage, 'META-INF', 'vault'), { recursive: true });

  let mapping = null;
  if (o.assetMapping) {
    const mapPath = resolve(o.assetMapping);
    if (!existsSync(mapPath)) {
      console.error(`Asset mapping not found: ${o.assetMapping}`);
      console.error('Generate it first by running assets.mjs, e.g.:');
      console.error(`  node tools/migrate/assets.mjs --src ${o.src} --dam-root /content/dam/personalized-knee/knee --mapping-out ${o.assetMapping} --out personalized-knee-assets.zip`);
      process.exit(1);
    }
    const raw = readFileSync(mapPath, 'utf-8').trim();
    if (!raw) {
      console.error(`Asset mapping is empty: ${o.assetMapping}`);
      console.error('Re-run assets.mjs to (re)generate it before packaging with --asset-mapping.');
      process.exit(1);
    }
    mapping = JSON.parse(raw);
  }

  let n = 0; let repl = 0;
  for (const f of readdirSync(src).filter((x) => x.endsWith('.xml'))) {
    let xml = readFileSync(join(src, f), 'utf-8');
    if (mapping) {
      for (const [url, dam] of Object.entries(mapping)) {
        if (xml.includes(url)) { xml = xml.split(url).join(dam); repl += 1; }
      }
    }
    const nodeDir = join(nodeRoot, f.replace(/\.xml$/, ''));
    mkdirSync(nodeDir, { recursive: true });
    writeFileSync(join(nodeDir, '.content.xml'), xml, 'utf-8');
    n += 1;
  }

  writeFileSync(join(stage, 'META-INF', 'vault', 'filter.xml'), FILTER(o.jcrRoot));
  writeFileSync(join(stage, 'META-INF', 'vault', 'properties.xml'), PROPERTIES(o.name));

  // Zip: prefer `archiver`, then the `zip` CLI, then a pure-Node fallback.
  const outZip = resolve(o.out);
  let zipped = false;
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
    zipped = true;
  } catch { /* fall through */ }

  if (!zipped) {
    try {
      const { execFileSync } = require('child_process');
      execFileSync('zip', ['-qr', outZip, '.'], { cwd: stage });
      zipped = true;
    } catch { /* fall through */ }
  }

  if (!zipped) {
    // Pure-Node fallback: python3 zipfile (no deps, present on most systems).
    const { execFileSync } = require('child_process');
    execFileSync('python3', ['-c', `import zipfile,os,sys
stage,out=sys.argv[1],sys.argv[2]
z=zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED)
for r,_,fs in os.walk(stage):
  for f in fs:
    p=os.path.join(r,f); z.write(p,os.path.relpath(p,stage))
z.close()`, stage, outZip]);
  }

  rmSync(stage, { recursive: true });
  console.log(`Packaged ${n} nodes -> ${o.out}`);
  if (mapping) console.log(`Rewrote ${repl} image reference(s) to DAM paths.`);
}

main();
