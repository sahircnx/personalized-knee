/**
 * Understanding Knee Pain — Hero Banner Block
 *
 * Document row order (from AEM/DA):
 *   0 — picture (hero image)
 *   1 — overlay text  ("A real Personalized Knee® experience")
 *   2 — image position ("left" | "right")
 *   3 — eyebrow       ("Understanding Knee Pain")
 *   4 — heading       ("Living with knee pain…")
 *   5 — description   ("Is your knee staging a tantrum?…")
 *   6 — link          (<a href="#arthritis">Let's explore</a>)
 *   7+  unused / empty rows
 */
export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  /** Pull the single div child out of a row, or return the row itself. */
  const cell = (idx) => {
    const row = rows[idx];
    if (!row) return null;
    return (row.children.length === 1 && row.firstElementChild.tagName === 'DIV')
      ? row.firstElementChild
      : row;
  };

  const imageCell   = cell(0);
  const overlayCell = cell(1);
  const positionCell = cell(2);
  const eyebrowCell  = cell(3);
  const headingCell  = cell(4);
  const descCell     = cell(5);
  const linkCell     = cell(6);

  // ── Build DOM ──────────────────────────────────────────────────────────────

  const container = document.createElement('div');
  container.className = 'ukp-inner';

  // Image position: "right" means image on right, text on left (default)
  const position = positionCell?.textContent?.trim().toLowerCase() || 'right';
  container.dataset.imagePosition = position;

  // ── Text column ────────────────────────────────────────────────────────────
  const textCol = document.createElement('div');
  textCol.className = 'ukp-text';

  if (eyebrowCell?.textContent?.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'ukp-eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    textCol.append(eyebrow);
  }

  if (headingCell?.textContent?.trim()) {
    const h1 = document.createElement('h1');
    h1.className = 'ukp-heading';
    h1.textContent = headingCell.textContent.trim();
    textCol.append(h1);
  }

  if (descCell?.textContent?.trim()) {
    const desc = document.createElement('div');
    desc.className = 'ukp-desc';
    desc.innerHTML = descCell.innerHTML;
    textCol.append(desc);
  }

  const anchor = linkCell?.querySelector('a');
  if (anchor) {
    const btn = document.createElement('a');
    btn.href = anchor.href;
    btn.className = 'ukp-link';
    btn.textContent = anchor.textContent.trim();
    textCol.append(btn);
  }

  // ── Image column ───────────────────────────────────────────────────────────
  const imageCol = document.createElement('div');
  imageCol.className = 'ukp-image';

  const picture = imageCell?.querySelector('picture');
  if (picture) imageCol.append(picture);

  // Overlay label ("A real Personalized Knee® experience")
  if (overlayCell?.textContent?.trim()) {
    const label = document.createElement('p');
    label.className = 'ukp-disclaimer';
    label.textContent = overlayCell.textContent.trim();
    imageCol.append(label);
  }

  // ── Assemble ───────────────────────────────────────────────────────────────
  // Text always first in DOM; CSS `order` handles visual flip for image-left
  container.append(textCol);
  container.append(imageCol);
  block.textContent = '';
  block.append(container);
}
