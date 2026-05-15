import { decorateIcons } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  /** Get the field cells from a row, handling xwalk wrapper divs. */
  const getFields = (row) => {
    if (!row) return [];
    if (row.children.length === 1 && row.firstElementChild.tagName === 'DIV') {
      return [...row.firstElementChild.children];
    }
    return [...row.children];
  };

  const headingRow = rows[0];
  const btnLinkRow = rows[1];
  const btnLabelRow = rows[2];
  const upsideRow = rows[3];
  const downsideRow = rows[4];

  block.textContent = '';

  // ── Inner wrapper ──────────────────────────────────────────────────────────
  const inner = document.createElement('div');
  inner.className = 'pros-cons-inner';

  // ── Heading ────────────────────────────────────────────────────────────────
  const headingText = headingRow?.textContent?.trim();
  if (headingText) {
    const h2 = document.createElement('h2');
    h2.className = 'pros-cons-heading';
    h2.textContent = headingText;
    inner.append(h2);
  }

  // ── Cards ──────────────────────────────────────────────────────────────────
  const cardsRow = document.createElement('div');
  cardsRow.className = 'pros-cons-cards';

  [
    { row: upsideRow, cls: 'pros' },
    { row: downsideRow, cls: 'cons' },
  ].forEach(({ row, cls }) => {
    if (!row) return;
    const fields = getFields(row);
    if (fields.length === 0) return;

    const card = document.createElement('div');
    card.className = `pros-cons-card ${cls}`;

    // Card title (field 0)
    const titleText = fields[0]?.textContent?.trim();
    if (titleText) {
      const h3 = document.createElement('h3');
      h3.className = 'pros-cons-card-title';
      h3.textContent = titleText;
      card.append(h3);
    }

    // List content (field 1) — keep the full innerHTML (ul + any trailing p)
    if (fields[1]) {
      const contentWrap = document.createElement('div');
      contentWrap.className = 'pros-cons-card-body';
      contentWrap.innerHTML = fields[1].innerHTML;
      card.append(contentWrap);
    }

    cardsRow.append(card);
  });

  inner.append(cardsRow);

  // ── CTA button ─────────────────────────────────────────────────────────────
  const btnLink = btnLinkRow?.querySelector('a');
  const btnLabel = btnLabelRow?.textContent?.trim();

  if (btnLabel) {
    const ctaWrap = document.createElement('div');
    ctaWrap.className = 'pros-cons-cta';

    const a = document.createElement('a');
    a.href = btnLink?.href || '#';
    a.textContent = btnLabel;
    ctaWrap.append(a);
    inner.append(ctaWrap);
  }

  block.append(inner);

}
