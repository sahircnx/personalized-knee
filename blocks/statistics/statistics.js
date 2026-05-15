export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  /** Get the field cells from a row, handling xwalk wrapper divs. */
  const getField = (row) => {
    if (!row) return null;
    if (row.children.length === 1 && row.firstElementChild.tagName === 'DIV') {
      return row.firstElementChild;
    }
    return row.children[0] || row;
  };

  // Row layout from authoring:
  // row 0 → background picture (decorative, skipped — SVG used as CSS bg)
  // row 1 → main heading
  // row 2 → pre-stat label ("An estimated")
  // row 3 → large stat number ("1,000,000")
  // row 4 → post-stat label ("knee replacement surgeries are performed every year!")
  // row 5 → body paragraph

  const bgRow = rows[0];       // skip (decorative)
  const headingRow = rows[1];
  const preLabelRow = rows[2];
  const numberRow = rows[3];
  const postLabelRow = rows[4];
  const bodyRow = rows[5];

  block.textContent = '';

  // ── Heading ────────────────────────────────────────────────────────────────
  const headingText = getField(headingRow)?.textContent?.trim();
  if (headingText) {
    const wrap = document.createElement('div');
    wrap.className = 'statistics-heading-wrap';
    const h1 = document.createElement('h1');
    h1.className = 'statistics-heading';
    h1.textContent = headingText;
    wrap.append(h1);
    block.append(wrap);
  }

  // ── Stat block ─────────────────────────────────────────────────────────────
  const statWrap = document.createElement('div');
  statWrap.className = 'statistics-stat';

  const preLabelText = getField(preLabelRow)?.textContent?.trim();
  if (preLabelText) {
    const h4 = document.createElement('h4');
    h4.className = 'statistics-pre-label';
    h4.textContent = preLabelText;
    statWrap.append(h4);
  }

  const numberText = getField(numberRow)?.textContent?.trim();
  if (numberText) {
    const h2 = document.createElement('h2');
    h2.className = 'statistics-number';
    h2.textContent = numberText;
    statWrap.append(h2);
  }

  const postLabelText = getField(postLabelRow)?.textContent?.trim();
  if (postLabelText) {
    const h4 = document.createElement('h4');
    h4.className = 'statistics-post-label';
    h4.textContent = postLabelText;
    statWrap.append(h4);
  }

  block.append(statWrap);

  // ── Body ───────────────────────────────────────────────────────────────────
  const bodyField = getField(bodyRow);
  if (bodyField?.textContent?.trim()) {
    const bodyWrap = document.createElement('div');
    bodyWrap.className = 'statistics-body';
    bodyWrap.innerHTML = bodyField.innerHTML;
    block.append(bodyWrap);
  }
}
