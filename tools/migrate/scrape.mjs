#!/usr/bin/env node
/**
 * Stage 1 — Scrape source pages into EDS content.
 *
 * For each URL: loads the page in Chromium, injects the WebImporter bundle and
 * the project's bundled import script, runs the transform, and writes:
 *   - content/<path>.plain.html  (DA-format block HTML, used by the preview)
 *   - content/<path>.md          (gridtable markdown, used by md2jcr in stage 3)
 *
 * Usage:
 *   node tools/migrate/scrape.mjs \
 *     --import-script tools/importer/import-knee-article.bundle.js \
 *     --urls tools/importer/urls-knee-article.txt \
 *     [--out content] [--concurrency 1]
 *
 * Notes baked in from the migration run:
 *   - Consent-manager scripts (OneTrust OtAutoBlock.js) are network-blocked:
 *     they redefine document.createElement as non-configurable and break the
 *     importer's script injection.
 *   - Navigation waits for 'domcontentloaded' (server-rendered content is ready
 *     then) plus a short best-effort networkidle budget — the source's tracking
 *     scripts never go network-idle, so waiting for it stalls every page ~45s.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';
import { JSDOM } from 'jsdom';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAGE_TIMEOUT = 45000;
const CONSENT_RE = /(cookielaw\.org|onetrust\.com|otSDKStub|OtAutoBlock)/i;

function parseArgs() {
  const a = process.argv.slice(2);
  const o = { out: 'content', concurrency: 1 };
  for (let i = 0; i < a.length; i += 1) {
    const k = a[i];
    if (k === '--import-script') o.importScript = a[++i];
    else if (k === '--urls') o.urls = a[++i];
    else if (k === '--out') o.out = a[++i];
    else if (k === '--concurrency') o.concurrency = parseInt(a[++i], 10) || 1;
    else { console.error(`Unknown arg: ${k}`); process.exit(1); }
  }
  if (!o.importScript || !o.urls) {
    console.error('Usage: node tools/migrate/scrape.mjs --import-script <bundle.js> --urls <urls.txt> [--out content] [--concurrency 1]');
    process.exit(1);
  }
  return o;
}

function loadUrls(file) {
  return readFileSync(file, 'utf-8')
    .split('\n').map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'));
}

function sanitizePath(p) {
  // /knee/foo.html -> knee/foo
  return p.replace(/^\/+/, '').replace(/\/$/, '').replace(/\.html$/, '');
}

// Wrap bare <img> (from md2da output) in <picture> so block markup matches.
function processPlainHtml(html) {
  const dom = new JSDOM(html.startsWith('<') ? html : `<div>${html}</div>`);
  const doc = dom.window.document;
  doc.querySelectorAll('img').forEach((img) => {
    if (img.closest('picture')) return;
    const pic = doc.createElement('picture');
    img.parentNode.insertBefore(pic, img);
    pic.appendChild(img);
  });
  return doc.body ? doc.body.innerHTML : html;
}

async function scrapeOne(page, url, importScript, helixBundle, outDir) {
  await page.route(CONSENT_RE, (route) => route.abort());
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: PAGE_TIMEOUT });
  try {
    await page.waitForLoadState('networkidle', { timeout: 5000 });
  } catch {
    await page.waitForTimeout(2000);
  }

  await page.evaluate((script) => {
    const el = document.createElement('script');
    el.textContent = script;
    document.head.appendChild(el);
  }, helixBundle);
  await page.evaluate((script) => {
    const el = document.createElement('script');
    el.textContent = script;
    document.head.appendChild(el);
  }, importScript);

  await page.waitForFunction(
    () => typeof window.CustomImportScript !== 'undefined' && window.CustomImportScript?.default,
    { timeout: 10000 },
  );

  const result = await page.evaluate(async (pageUrl) => {
    const cfg = window.CustomImportScript.default;
    if (typeof cfg.onLoad === 'function') await cfg.onLoad({ document });
    const r = await window.WebImporter.html2md(pageUrl, document, cfg, {
      toDocx: false, toMd: true, originalURL: pageUrl,
    });
    r.html = window.WebImporter.md2da(r.md);
    return r;
  }, url);

  const rel = sanitizePath(result.path || new URL(url).pathname);
  const plainPath = join(outDir, `${rel}.plain.html`);
  const mdPath = join(outDir, `${rel}.md`);
  mkdirSync(dirname(plainPath), { recursive: true });
  writeFileSync(plainPath, processPlainHtml(result.html), 'utf-8');
  if (result.md) writeFileSync(mdPath, result.md, 'utf-8');
  return rel;
}

async function main() {
  const o = parseArgs();
  const importScript = readFileSync(resolve(o.importScript), 'utf-8');
  const helixBundle = readFileSync(join(__dirname, 'vendor', 'helix-importer.js'), 'utf-8');
  const urls = loadUrls(resolve(o.urls));
  const outDir = resolve(o.out);
  mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    ignoreHTTPSErrors: true,
  });

  let ok = 0; let fail = 0;
  for (let i = 0; i < urls.length; i += 1) {
    const url = urls[i];
    const label = `[${i + 1}/${urls.length}]`;
    const page = await context.newPage();
    try {
      const rel = await scrapeOne(page, url, importScript, helixBundle, outDir);
      ok += 1;
      console.log(`${label} ✅ ${rel}`);
    } catch (e) {
      fail += 1;
      console.error(`${label} ❌ ${url}: ${e.message.split('\n')[0]}`);
    } finally {
      await page.close().catch(() => {});
    }
  }
  await browser.close();
  console.log(`\nDone. Success ${ok}/${urls.length}, failures ${fail}`);
  if (fail) process.exitCode = 1;
}

main();
