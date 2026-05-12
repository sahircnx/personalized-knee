export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const cell = (idx) => rows[idx]?.firstElementChild || null;

  // Determine if row 0 is the 'classes' dropdown or the background image
  // If row 0 has a picture, it's the background image (index 0)
  // If not, row 0 is classes, and background image starts at index 1
  let contentStart = 0;
  if (cell(0) && !cell(0).querySelector('picture')) {
    const variant = cell(0).textContent.trim();
    if (variant && variant !== 'default') {
      block.classList.add(variant);
    }
    contentStart = 1;
  }

  const backgroundImageCell = cell(contentStart);
  const headingCell = cell(contentStart + 1);
  const descCell = cell(contentStart + 2);
  const disclaimerCell = cell(contentStart + 3);
  const primaryBtnTextCell = cell(contentStart + 4);
  const primaryBtnLinkCell = cell(contentStart + 5);
  const secondaryLinkTextCell = cell(contentStart + 6);
  const secondaryLinkUrlCell = cell(contentStart + 7);

  // ── Build DOM ──────────────────────────────────────────────────────────────
  const container = document.createElement('div');
  container.className = 'teaser-inner';

  // Heading
  if (headingCell?.textContent?.trim()) {
    const heading = document.createElement('h2');
    heading.className = 'teaser-heading';
    heading.textContent = headingCell.textContent.trim();
    container.append(heading);
  }

  // Description
  if (descCell?.innerHTML?.trim()) {
    const desc = document.createElement('div');
    desc.className = 'teaser-description';
    desc.innerHTML = descCell.innerHTML;
    container.append(desc);
  }

  // Disclaimer
  if (disclaimerCell?.innerHTML?.trim()) {
    const disclaimer = document.createElement('div');
    disclaimer.className = 'teaser-disclaimer';
    disclaimer.innerHTML = disclaimerCell.innerHTML;
    container.append(disclaimer);
  }

  // Actions
  const actions = document.createElement('div');
  actions.className = 'teaser-actions';

  // Primary Button
  const pLink = primaryBtnLinkCell?.querySelector('a') || primaryBtnLinkCell;
  const pText = primaryBtnTextCell?.textContent?.trim() || pLink?.textContent?.trim();
  if (pLink && pText) {
    const btn = document.createElement('a');
    btn.href = pLink.href || pLink.textContent.trim();
    btn.className = 'button primary teaser-primary-btn';
    btn.textContent = pText;
    actions.append(btn);
  }

  // Secondary Link
  const sLink = secondaryLinkUrlCell?.querySelector('a') || secondaryLinkUrlCell;
  const sText = secondaryLinkTextCell?.textContent?.trim() || sLink?.textContent?.trim();
  if (sLink && sText) {
    const link = document.createElement('a');
    link.href = sLink.href || sLink.textContent.trim();
    link.className = 'teaser-secondary-link';
    link.textContent = sText;
    actions.append(link);
  }

  if (actions.children.length > 0) {
    container.append(actions);
  }

  // Background Image
  const picture = backgroundImageCell?.querySelector('picture');
  if (picture) {
    picture.className = 'teaser-bg';
    block.prepend(picture);
  }

  block.append(container);

  // Remove original rows
  rows.forEach((row) => row.remove());
}
