#!/usr/bin/env node
/**
 * Stage 3 — Convert gridtable markdown to JCR XML (xwalk / Universal Editor).
 *
 * Reads content/<dir>/*.md and the project's component-*.json (build them first
 * with `npm run build:json`), and writes JCR XML to the output directory.
 *
 * Usage:
 *   node tools/migrate/md2jcr.mjs \
 *     --src content/knee \
 *     --out tools/migrate/jcr-out/knee
 *
 * A single .md file may also be converted:
 *   node tools/migrate/md2jcr.mjs --file content/knee/foo.md --out tools/migrate/jcr-out/knee
 */
import { md2jcr } from '@adobe/helix-md2jcr';
import {
  readFileSync, writeFileSync, readdirSync, mkdirSync,
} from 'fs';
import { resolve, join, basename } from 'path';

function parseArgs() {
  const a = process.argv.slice(2);
  const o = {};
  for (let i = 0; i < a.length; i += 1) {
    const k = a[i];
    if (k === '--src') o.src = a[++i];
    else if (k === '--file') o.file = a[++i];
    else if (k === '--out') o.out = a[++i];
    else { console.error(`Unknown arg: ${k}`); process.exit(1); }
  }
  if ((!o.src && !o.file) || !o.out) {
    console.error('Usage: node tools/migrate/md2jcr.mjs (--src <dir> | --file <f.md>) --out <dir>');
    process.exit(1);
  }
  return o;
}

function loadComponents(repo) {
  const models = JSON.parse(readFileSync(join(repo, 'component-models.json'), 'utf-8'));
  const defRaw = JSON.parse(readFileSync(join(repo, 'component-definition.json'), 'utf-8'));
  const filters = JSON.parse(readFileSync(join(repo, 'component-filters.json'), 'utf-8'));
  const definition = defRaw.groups
    ? defRaw
    : { groups: [{ title: 'Blocks', id: 'blocks', components: defRaw.definitions || defRaw }] };
  return { models, definition, filters };
}

async function convert(mdPath, outDir, components) {
  const md = readFileSync(mdPath, 'utf-8');
  const jcr = String(await md2jcr(md, components));
  if (!jcr.includes('<jcr:root')) throw new Error('no jcr:root in output');
  const outPath = join(outDir, `${basename(mdPath, '.md')}.xml`);
  writeFileSync(outPath, jcr, 'utf-8');
  return outPath;
}

async function main() {
  const o = parseArgs();
  const repo = process.cwd();
  const components = loadComponents(repo);
  const outDir = resolve(o.out);
  mkdirSync(outDir, { recursive: true });

  const files = o.file
    ? [resolve(o.file)]
    : readdirSync(resolve(o.src)).filter((f) => f.endsWith('.md')).map((f) => join(resolve(o.src), f));

  let ok = 0; let fail = 0;
  for (const f of files) {
    try {
      await convert(f, outDir, components);
      ok += 1;
    } catch (e) {
      fail += 1;
      console.error(`FAIL ${basename(f)}: ${e.message.split('\n')[0]}`);
    }
  }
  console.log(`Converted ${ok}/${files.length} (failures ${fail})`);
  if (fail) {
    console.error('\nNote: a few source pages contain embedded data tables or blockquotes that');
    console.error('md2jcr cannot map to a block. See the README "Edge cases" section for the fix.');
    process.exitCode = 1;
  }
}

main();
