import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  /** Pull the content div out of a row, handling xwalk's wrapper divs if present. */
  const getFields = (row) => {
    if (!row) return [];
    // If the row has a single DIV child, it's likely the xwalk wrapper; use its children (the fields)
    if (row.children.length === 1 && row.firstElementChild.tagName === 'DIV') {
      return [...row.firstElementChild.children];
    }
    // Otherwise, the fields are direct children of the row
    return [...row.children];
  };

  // ── Parse Parent Data ──────────────────────────────────────────────────────
  let contentStart = 0;
  const firstFields = getFields(rows[0]);
  const firstRowText = rows[0]?.textContent?.trim().toLowerCase();
  
  if (firstRowText && !rows[0].querySelector('picture') && firstFields.length === 1) {
    if (firstRowText !== 'default') {
      block.classList.add(firstRowText);
    }
    contentStart = 1;
  }

  const bgRow = rows[contentStart];
  const eyebrowRow = rows[contentStart + 1];
  const headingRow = rows[contentStart + 2];
  const itemRows = rows.slice(contentStart + 3);

  // ── Build DOM ──────────────────────────────────────────────────────────────
  block.textContent = '';

  // 1. Background
  const bgWrapper = document.createElement('div');
  bgWrapper.className = 'ukps-bg';
  const bgPic = bgRow?.querySelector('picture');
  if (bgPic) {
    const img = bgPic.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '2000' }]);
      bgWrapper.append(optimizedPic);
    } else {
      bgWrapper.append(bgPic);
    }
  }
  block.append(bgWrapper);

  const inner = document.createElement('div');
  inner.className = 'ukps-inner';

  // 2. Left Section (Sticky)
  const leftCol = document.createElement('div');
  leftCol.className = 'ukps-left';

  if (eyebrowRow?.textContent?.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'ukps-eyebrow';
    eyebrow.textContent = eyebrowRow.textContent.trim();
    leftCol.append(eyebrow);
  }

  if (headingRow?.textContent?.trim()) {
    const heading = document.createElement('h2');
    heading.className = 'ukps-heading';
    heading.textContent = headingRow.textContent.trim();
    leftCol.append(heading);
  }
  inner.append(leftCol);

  // 3. Right Section (Cards)
  const rightCol = document.createElement('div');
  rightCol.className = 'ukps-right';

  itemRows.forEach((row) => {
    const fields = getFields(row);
    if (fields.length === 0) return;

    const card = document.createElement('div');
    
    // sign-item: icon (0), number (1), title (2), description (3)
    // sign-cta: title (0), buttonText (1), buttonLink (2)
    
    if (fields.length >= 4) {
      // Knee Pain Sign Item
      card.className = 'ukps-card sign-item';
      
      const iconWrap = document.createElement('div');
      iconWrap.className = 'ukps-card-icon';
      const iconPic = fields[0]?.querySelector('picture');
      if (iconPic) iconWrap.append(iconPic);
      card.append(iconWrap);

      const numWrap = document.createElement('div');
      numWrap.className = 'ukps-card-number';
      numWrap.textContent = fields[1]?.textContent?.trim();
      card.append(numWrap);

      const contentWrap = document.createElement('div');
      contentWrap.className = 'ukps-card-content';
      
      const title = document.createElement('h3');
      title.className = 'ukps-card-title';
      title.textContent = fields[2]?.textContent?.trim();
      contentWrap.append(title);

      const desc = document.createElement('div');
      desc.className = 'ukps-card-desc';
      desc.innerHTML = fields[3]?.innerHTML || '';
      contentWrap.append(desc);

      card.append(contentWrap);
    } else if (fields.length >= 2) {
      // Knee Pain Sign CTA
      card.className = 'ukps-card sign-cta';

      const ctaTitle = document.createElement('h3');
      ctaTitle.className = 'ukps-cta-title';
      ctaTitle.textContent = fields[0]?.textContent?.trim();
      card.append(ctaTitle);

      const link = fields[2]?.querySelector('a') || fields[1]?.querySelector('a');
      if (link) {
        const btn = document.createElement('a');
        btn.href = link.href;
        btn.className = 'button primary ukps-cta-btn';
        btn.textContent = fields[1]?.textContent?.trim() || link.textContent;
        card.append(btn);
      }
    }
    
    rightCol.append(card);
  });

  inner.append(rightCol);
  block.append(inner);
}
