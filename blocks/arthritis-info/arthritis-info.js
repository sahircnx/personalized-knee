import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const cell = (rowIdx, colIdx = 0) => {
    const row = rows[rowIdx];
    if (!row) return null;
    const col = row.children[colIdx];
    return col || null;
  };

  // Extract main content fields (Rows 0-6)
  const imageCell = cell(0);
  const captionCell = cell(1);
  const eyebrowCell = cell(2);
  const titleCell = cell(3);
  const descCell = cell(4);
  const linkCell = cell(5);
  const textCell = cell(6);

  // Extract cards (Rows 7+)
  const cards = rows.slice(7).map((row) => {
    const icon = row.children[0]?.querySelector('picture, img');
    const title = row.children[1]?.textContent?.trim();
    const description = row.children[2]?.innerHTML;
    return { icon, title, description };
  });

  // ── Build DOM ──────────────────────────────────────────────────────────────
  const container = document.createElement('div');
  container.className = 'ai-inner';

  // ── Image Column ───────────────────────────────────────────────────────────
  const imageCol = document.createElement('div');
  imageCol.className = 'ai-image-col';

  const picture = imageCell?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      imageCol.append(optimizedPic);
    } else {
      imageCol.append(picture);
    }
  }

  if (captionCell?.textContent?.trim()) {
    const caption = document.createElement('span');
    caption.className = 'ai-image-caption';
    caption.textContent = captionCell.textContent.trim();
    imageCol.append(caption);
  }

  // ── Content Column ─────────────────────────────────────────────────────────
  const contentCol = document.createElement('div');
  contentCol.className = 'ai-content-col';

  if (eyebrowCell?.textContent?.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'ai-eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    contentCol.append(eyebrow);
  }

  if (titleCell?.textContent?.trim()) {
    const title = document.createElement('h2');
    title.className = 'ai-title';
    title.textContent = titleCell.textContent.trim();
    contentCol.append(title);
  }

  if (descCell?.innerHTML?.trim()) {
    const desc = document.createElement('div');
    desc.className = 'ai-description';
    desc.innerHTML = descCell.innerHTML;
    contentCol.append(desc);
  }

  // Cards
  if (cards.length > 0) {
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'ai-cards-container';

    cards.forEach((card) => {
      const cardDiv = document.createElement('div');
      cardDiv.className = 'ai-card';

      if (card.icon) {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'ai-card-icon';
        iconDiv.append(card.icon);
        cardDiv.append(iconDiv);
      }

      const cardText = document.createElement('div');
      cardText.className = 'ai-card-text';

      if (card.title) {
        const cardTitle = document.createElement('h3');
        cardTitle.className = 'ai-card-title';
        cardTitle.textContent = card.title;
        cardText.append(cardTitle);
      }

      if (card.description) {
        const cardDesc = document.createElement('div');
        cardDesc.className = 'ai-card-description';
        cardDesc.innerHTML = card.description;
        cardText.append(cardDesc);
      }

      cardDiv.append(cardText);
      cardsContainer.append(cardDiv);
    });

    contentCol.append(cardsContainer);
  }

  // CTA Link
  const anchor = linkCell?.querySelector('a');
  const ctaText = textCell?.textContent?.trim() || anchor?.textContent?.trim();
  if (anchor || ctaText) {
    const ctaContainer = document.createElement('div');
    ctaContainer.className = 'ai-cta-container';
    
    const btn = document.createElement('a');
    btn.href = anchor ? anchor.href : '#';
    btn.className = 'button secondary';
    btn.textContent = ctaText;
    ctaContainer.append(btn);
    contentCol.append(ctaContainer);
  }

  // ── Final Assemble ────────────────────────────────────────────────────────
  container.append(imageCol);
  container.append(contentCol);
  block.textContent = '';
  block.append(container);
}
