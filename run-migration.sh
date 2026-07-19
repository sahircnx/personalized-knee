#!/bin/zsh

# Exit immediately if any command exits with a non-zero status
set -e

echo "🚀 Starting migration pipeline..."

# Step 1: Scrape
echo "\n🔹 Step 1: Scraping articles..."
node tools/migrate/scrape.mjs \
  --import-script tools/importer/import-knee-article.bundle.js \
  --urls tools/importer/urls-knee-article.txt \
  --out content

# Step 2: Convert and Package
echo "\n🔹 Step 2: Converting Markdown to JCR..."
node tools/migrate/md2jcr.mjs \
  --src content/knee \
  --out tools/migrate/jcr-out/knee

echo "\n🔹 Step 3: Packaging articles..."
node tools/migrate/package.mjs \
  --src tools/migrate/jcr-out/knee \
  --jcr-root /content/zb-thereadypatient-agentic/knee \
  --name zb-thereadypatient-agentic-articles \
  --out zb-thereadypatient-agentic-articles.zip

echo "\n🔹 Step 4: Processing assets..."
node tools/migrate/assets.mjs \
  --src tools/migrate/jcr-out/knee \
  --dam-root /content/dam/zb-thereadypatient-agentic/knee \
  --mapping-out tools/migrate/asset-mapping.json \
  --out zb-thereadypatient-agentic-assets.zip

echo "\n🔹 Step 5: Packaging articles with asset mappings..."
node tools/migrate/package.mjs \
  --src tools/migrate/jcr-out/knee \
  --jcr-root /content/zb-thereadypatient-agentic/knee \
  --name zb-thereadypatient-agentic-articles-dam \
  --out zb-thereadypatient-agentic-articles-dam-refs.zip \
  --asset-mapping tools/migrate/asset-mapping.json

echo "\n✅ Migration complete!"