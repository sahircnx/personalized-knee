# Knee-article migration pipeline (run it locally)

Reproduce the whole migration — from source pages to installable AEM content
packages — on your own machine. Everything the pipeline needs lives in this
repo (parsers, transformers, import script, block models) plus the three
scripts in this folder.

```
source pages ──▶ scrape ──▶ content/*.plain.html + *.md
                              │
component-*.json ◀── build:json (npm)
                              │
              md2jcr ──▶ JCR XML ──▶ package ──▶ .zip ──▶ install in AEM
```

## Prerequisites

- Node 20+ (tested on Node 24)
- From the **repo root**, install your EDS project deps once: `npm install`
- Install the migration-tool deps (isolated from the EDS project):

```bash
cd tools/migrate
npm install          # also runs `playwright install chromium`
cd ../..
```

> The migration tools have their own `package.json` on purpose — the EDS
> project itself stays dependency-free. Run the `node tools/migrate/*.mjs`
> commands below **from the repo root**.

## Inputs already in the repo

- `tools/importer/import-knee-article.js` + `.bundle.js` — the import script
- `tools/importer/parsers/*.js` — one parser per block variant
- `tools/importer/transformers/*.js` — DOM cleanup + section breaks
- `tools/importer/page-templates.json` — template + block selectors
- `tools/importer/urls-knee-article.txt` — the 151 article URLs
- `blocks/*/` — block code, CSS, and xwalk models (`_*.json`)

If you change a parser/transformer/import script, re-bundle it first:

```bash
npx @adobe/aem-import-helper bundle --importjs tools/importer/import-knee-article.js
```

## Step 1 — Scrape source pages → content

```bash
node tools/migrate/scrape.mjs \
  --import-script tools/importer/import-knee-article.bundle.js \
  --urls tools/importer/urls-knee-article.txt \
  --out content
```

Writes `content/knee/<article>.plain.html` (preview) and
`content/knee/<article>.md` (for md2jcr). ~10 s/page.

Preview locally with the AEM CLI (serves the `content/` folder):

```bash
aem up --html-folder content --prefer-plain-html --no-open --port 3000
# open http://localhost:3000/content/knee/<article>
```

## Step 2 — Build the Universal Editor component JSON

```bash
npm run build:json     # merges blocks/*/_*.json -> component-{models,definition,filters}.json
```

Run this whenever you add or change a block model.

## Step 3 — Convert markdown → JCR XML

```bash
node tools/migrate/md2jcr.mjs \
  --src content/knee \
  --out tools/migrate/jcr-out/knee
```

### Edge cases (3 of 151 pages)

A few source pages contain a **data table** or a **blockquote** that md2jcr
can't map to a block, so they fail with `The component 'X' does not exist` or
`Element 'blockquote' is currently not supported`. Fix the affected `.md`,
then re-run md2jcr just for that file:

- **Blockquote** (`superfoods-for-joint-health`): remove the leading `> ` from
  the quoted lines so it becomes a normal paragraph.
- **Data table** (`decoding-insurance-coding`,
  `whats-the-difference-between-a-general-practitioner-and-an-orthopedic-surgeon`):
  the orphan gridtable's first cell is read as a block name. Prepend a
  `Columns` block header so md2jcr treats it as a Columns block — insert three
  lines immediately **before** the table's top border (matching its width):

  ```
  +----- … (same width) -----+
  | Columns                  |
  +===== … (same width) =====+
  ```

Then: `node tools/migrate/md2jcr.mjs --file content/knee/<name>.md --out tools/migrate/jcr-out/knee`

## Step 4 — Package the JCR into a content package

Plain package (image refs still point at the source domain):

```bash
node tools/migrate/package.mjs \
  --src tools/migrate/jcr-out/knee \
  --jcr-root /content/personalized-knee/knee \
  --name personalized-knee-articles \
  --out personalized-knee-articles.zip
```

DAM-referenced package (rewrites image URLs to your DAM). Requires an
`asset-mapping.json` of `{ "<sourceImageUrl>": "/content/dam/personalized-knee/knee/<file>" }`:

```bash
node tools/migrate/package.mjs \
  --src tools/migrate/jcr-out/knee \
  --jcr-root /content/personalized-knee/knee \
  --name personalized-knee-articles-dam \
  --out personalized-knee-articles-dam-refs.zip \
  --asset-mapping tools/migrate/asset-mapping.json
```

## Step 5 — Install into AEM

- **CRXDE / Package Manager:** open `/crx/packmgr` on your author instance,
  upload the `.zip`, click **Install**. Install the **assets** package first,
  then the **content** package.
- **CLI:** `npx @adobe/aem-import-helper aem upload --zip <file.zip> --target <author-url> --token <token>`

## Assets (images) — `assets.mjs`

The content references source-domain image URLs until you upload the images to
your DAM. `assets.mjs` does the whole thing: scans the JCR for image URLs,
writes `asset-mapping.json`, downloads the images, and builds a `dam:Asset`
FileVault package.

```bash
node tools/migrate/assets.mjs \
  --src tools/migrate/jcr-out/knee \
  --dam-root /content/dam/personalized-knee/knee \
  --mapping-out tools/migrate/asset-mapping.json \
  --out personalized-knee-assets.zip
```

- `placehold.co` (a lazy-load placeholder on the source) is skipped by default;
  override with `--skip-hosts a,b`.
- Downloads are incremental — re-runs reuse already-fetched images.
- On install, AEM regenerates web renditions from the `original`.

Then package the **content** with references rewritten to those DAM paths using
the mapping this produced (the DAM-referenced package in Step 4):

```bash
node tools/migrate/package.mjs \
  --src tools/migrate/jcr-out/knee \
  --jcr-root /content/personalized-knee/knee \
  --name personalized-knee-articles-dam \
  --out personalized-knee-articles-dam-refs.zip \
  --asset-mapping tools/migrate/asset-mapping.json
```

Install order in AEM: **assets package first**, then the DAM-referenced content
package.

## One-shot

```bash
node tools/migrate/scrape.mjs --import-script tools/importer/import-knee-article.bundle.js --urls tools/importer/urls-knee-article.txt --out content \
&& npm run build:json \
&& node tools/migrate/md2jcr.mjs --src content/knee --out tools/migrate/jcr-out/knee \
&& node tools/migrate/package.mjs --src tools/migrate/jcr-out/knee --jcr-root /content/personalized-knee/knee --name personalized-knee-articles --out personalized-knee-articles.zip
```
