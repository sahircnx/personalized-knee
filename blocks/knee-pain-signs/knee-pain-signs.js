import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  /** Pull the field cells out of a row, handling xwalk wrapper divs. */
  const getFields = (row) => {
    if (!row) return [];
    if (row.children.length === 1 && row.firstElementChild.tagName === 'DIV') {
      return [...row.firstElementChild.children];
    }
    return [...row.children];
  };

  // ── Detect optional variant row ───────────────────────────────────────────
  let contentStart = 0;
  const firstFields = getFields(rows[0]);
  const firstRowText = rows[0]?.textContent?.trim().toLowerCase();

  if (firstRowText && !rows[0].querySelector('picture') && firstFields.length === 1) {
    if (firstRowText !== 'default') {
      block.classList.add(firstRowText);
    }
    contentStart = 1;
  }

  // Row layout: [bg image] [eyebrow] [heading] [...sign items] [...cta row]
  const bgRow = rows[contentStart];
  const eyebrowRow = rows[contentStart + 1];
  const headingRow = rows[contentStart + 2];
  const itemRows = rows.slice(contentStart + 3);

  // ── Clear original content ────────────────────────────────────────────────
  block.textContent = '';

  // ── 1. Sticky Left Panel ──────────────────────────────────────────────────
  const sticky = document.createElement('div');
  sticky.className = 'ukps-sticky';

  const imageWrap = document.createElement('div');
  imageWrap.className = 'ukps-image-wrap';

  // Background image
  const bgPic = bgRow?.querySelector('picture');
  const bgDiv = document.createElement('div');
  bgDiv.className = 'ukps-bg';
  if (bgPic) {
    const img = bgPic.querySelector('img');
    if (img) {
      const optimized = createOptimizedPicture(img.src, img.alt || '', false, [{ width: '1400' }]);
      bgDiv.append(optimized);
    } else {
      bgDiv.append(bgPic);
    }
  }
  imageWrap.append(bgDiv);

  // Eyebrow overlaid on image
  if (eyebrowRow?.textContent?.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'ukps-eyebrow';
    eyebrow.textContent = eyebrowRow.textContent.trim();
    imageWrap.append(eyebrow);
  }

  // Heading overlaid on image
  if (headingRow?.textContent?.trim()) {
    const heading = document.createElement('h2');
    heading.className = 'ukps-heading';
    heading.textContent = headingRow.textContent.trim();
    imageWrap.append(heading);
  }

  sticky.append(imageWrap);
  block.append(sticky);

  // ── 2. Cards Column ───────────────────────────────────────────────────────
  const cards = document.createElement('div');
  cards.className = 'ukps-cards';

  let signCount = 0;

  itemRows.forEach((row) => {
    const fields = getFields(row);
    if (fields.length === 0) return;

    const card = document.createElement('div');

    if (fields.length >= 3) {
      // Sign item: [icon] [number — ignored, CSS counter used] [title] [description]
      // Or could be: [title] [desc] if fewer fields — check by presence of picture
      const hasPicture = fields[0]?.querySelector('picture');

      if (hasPicture || fields.length >= 4) {
        // Sign card with icon, number, title, description
        signCount += 1;
        card.className = `ukps-card sign-item`;

        // Icon — field 0 (picture from authoring), placed in DOM so it's author-editable
        const iconPic = fields[0]?.querySelector('picture');
        if (iconPic) {
          const iconWrap = document.createElement('div');
          iconWrap.className = 'ukps-card-icon';
          iconWrap.append(iconPic);
          card.append(iconWrap);
        }

        // Card title — field 2 when icon present, field 0 otherwise
        const titleField = hasPicture ? fields[2] : fields[0];
        const descField = hasPicture ? fields[3] : fields[1];

        const titleEl = document.createElement('h3');
        titleEl.className = 'ukps-card-title';
        titleEl.textContent = titleField?.textContent?.trim() || '';
        card.append(titleEl);

        const descEl = document.createElement('div');
        descEl.className = 'ukps-card-desc';
        descEl.innerHTML = descField?.innerHTML || '';
        card.append(descEl);
      } else {
        // CTA card
        card.className = 'ukps-card sign-cta';

        const ctaTitle = document.createElement('h3');
        ctaTitle.className = 'ukps-cta-title';
        ctaTitle.textContent = fields[0]?.textContent?.trim() || '';
        card.append(ctaTitle);

        const link = fields[2]?.querySelector('a') || fields[1]?.querySelector('a');
        if (link) {
          const btn = document.createElement('a');
          btn.href = link.href;
          btn.className = 'ukps-cta-btn';
          btn.textContent = fields[1]?.textContent?.trim() || link.textContent.trim();
          card.append(btn);
        }
      }
    } else if (fields.length === 2) {
      // CTA card with 2 fields: [title] [button-link]
      card.className = 'ukps-card sign-cta';

      const ctaTitle = document.createElement('h3');
      ctaTitle.className = 'ukps-cta-title';
      ctaTitle.textContent = fields[0]?.textContent?.trim() || '';
      card.append(ctaTitle);

      const link = fields[1]?.querySelector('a');
      if (link) {
        const btn = document.createElement('a');
        btn.href = link.href;
        btn.className = 'ukps-cta-btn';
        btn.textContent = link.textContent.trim();
        card.append(btn);
      }
    }

    cards.append(card);
  });

  block.append(cards);
}
