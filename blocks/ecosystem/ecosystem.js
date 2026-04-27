/**
 * Ecosystem block.
 *
 * Content model (rows, 0-indexed):
 *   0  — background image (sticky parallax, full-width)
 *   1  — large heading ("Personalized for you at every step")
 *   2  — h5 label ("The Personalized Knee")
 *   3  — h2 tagline ("Unless you're a mannequin…")
 *   4  — empty spacer
 *   5  — primary CTA link text ("Find a PERSONALIZED KNEE Doctor")
 *   6  — empty spacer
 *   7  — secondary CTA link text ("Take the knee health quiz")
 *   8+ — card rows (4 cells each: image | product-title | h4-subtitle | body-text)
 *         Cards: 0 & 1 → left column (stacked), Card 2 → right column (vertically centred)
 */

export default function decorate(block) {
  const rows = [...block.children];

  /* ── helpers ─────────────────────────────────────────── */
  function cell(row, idx) {
    return row?.children[idx] ?? null;
  }
  function firstText(el) {
    return el?.textContent?.trim() ?? '';
  }

  /* ── 0: sticky background image ─────────────────────── */
  const bgRow = rows[0];
  bgRow.className = 'eco-bg';

  /* ── 1: large overlay heading ────────────────────────── */
  const headingRow = rows[1];
  headingRow.className = 'eco-heading';

  /* ── 2-7: bottom text + CTA ──────────────────────────── */
  const labelRow    = rows[2]; // h5 text
  const taglineRow  = rows[3]; // h2 text
  // rows[4] empty
  const cta1Row     = rows[5]; // primary CTA
  // rows[6] empty
  const cta2Row     = rows[7]; // secondary CTA

  /* ── 8+: cards ───────────────────────────────────────── */
  const cardRows = rows.slice(8);

  /* ── Build card DOM ───────────────────────────────────── */
  function buildCard(row) {
    if (!row) return null;
    const cells = [...row.children];

    const card = document.createElement('div');
    card.className = 'eco-card';

    // Background image — absolute fill
    const imgWrap = document.createElement('div');
    imgWrap.className = 'eco-card-image';
    if (cells[0]) imgWrap.append(...cells[0].childNodes);
    card.append(imgWrap);

    // Header: product-title (p) + h4 subtitle
    const header = document.createElement('div');
    header.className = 'eco-card-header';

    if (cells[1]) {
      const titleP = document.createElement('p');
      titleP.className = 'eco-card-label';
      titleP.textContent = firstText(cells[1]);
      header.append(titleP);
    }
    if (cells[2]) {
      const h4 = document.createElement('h4');
      h4.textContent = firstText(cells[2]);
      header.append(h4);
    }
    card.append(header);

    // Footer: body text
    if (cells[3]) {
      const footer = document.createElement('div');
      footer.className = 'eco-card-footer';
      footer.append(...cells[3].childNodes);
      card.append(footer);
    }

    return card;
  }

  /* ── Cards grid ───────────────────────────────────────── */
  const grid = document.createElement('div');
  grid.className = 'eco-cards-grid';

  const leftCol = document.createElement('div');
  leftCol.className = 'eco-cards-left';

  const rightCol = document.createElement('div');
  rightCol.className = 'eco-cards-right';

  cardRows.forEach((row, i) => {
    const card = buildCard(row);
    if (!card) return;
    if (i < 2) leftCol.append(card);
    else rightCol.append(card);
  });

  grid.append(leftCol, rightCol);

  /* ── Bottom CTA section ───────────────────────────────── */
  const bottom = document.createElement('div');
  bottom.className = 'eco-bottom';

  const bottomText = document.createElement('div');
  bottomText.className = 'eco-bottom-text';

  if (labelRow) {
    const h5 = document.createElement('h5');
    h5.textContent = firstText(labelRow);
    bottomText.append(h5);
  }
  if (taglineRow) {
    const h2 = document.createElement('h2');
    h2.textContent = firstText(taglineRow);
    bottomText.append(h2);
  }

  const btns = document.createElement('div');
  btns.className = 'eco-bottom-btns';

  if (cta1Row) {
    const a = document.createElement('a');
    a.className = 'button eco-btn-primary';
    a.textContent = firstText(cta1Row);
    a.href = '#find-a-specialist';
    btns.append(a);
  }
  if (cta2Row) {
    const a = document.createElement('a');
    a.className = 'button eco-btn-secondary';
    a.textContent = firstText(cta2Row);
    a.href = '/en/knee-pain-quiz.html';
    btns.append(a);
  }

  bottom.append(bottomText, btns);

  /* ── Assemble block ───────────────────────────────────── */
  block.textContent = '';
  block.append(bgRow, headingRow, grid, bottom);

  /* ── Parallax on scroll ───────────────────────────────── */
  const bgImg = bgRow.querySelector('img');
  if (bgImg && window.matchMedia('(min-width: 900px)').matches) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const rect = block.getBoundingClientRect();
        const progress = -rect.top / (rect.height - window.innerHeight);
        const clampedProgress = Math.max(0, Math.min(1, progress));
        // Subtle parallax: bg moves at 30% of scroll speed
        const offset = clampedProgress * 80;
        bgImg.style.transform = `translateY(${offset}px)`;
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }
}
