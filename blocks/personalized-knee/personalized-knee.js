export default async function decorate(block) {
  const rows = [...block.children];

  // Authored row structure:
  // Row 0: h2 heading
  // Row 1: *Compared to... footnote (small text, belongs with heading)
  // Row 2: h5 body paragraph
  // Row 3: gif image
  // Row 4: cards section heading ("Why The Personalized Knee...")
  // Row 5: disclaimer text
  // Row 6: empty (spacer)
  // Row 7: CTA button ("Explore the Persona Knee")
  // Rows 8+: icon cards (3 cols: icon, title, description)

  // Tag heading rows
  if (rows[0]) rows[0].classList.add('heading-row');
  if (rows[1]) rows[1].classList.add('body-row');  // *Compared footnote sits under heading
  if (rows[2]) rows[2].classList.add('gif-row');   // h5 body text
  if (rows[3]) rows[3].classList.add('gif-row');   // actual gif image — merge with body

  // Merge footnote into heading row so it renders beneath the h2
  if (rows[1]) {
    rows[0].appendChild(rows[1].firstElementChild || rows[1]);
    rows[1].remove();
  }

  // Re-read rows after removal
  const updatedRows = [...block.children];

  // updatedRows[0] = heading-row (h2 + footnote)
  // updatedRows[1] = gif-row (h5 body)
  // updatedRows[2] = gif-row (gif image)
  // updatedRows[3] = cards heading
  // updatedRows[4] = disclaimer
  // updatedRows[5] = empty spacer
  // updatedRows[6] = CTA
  // updatedRows[7+] = icon cards

  const cardsHeadingRow = updatedRows[3];
  const disclaimerRow = updatedRows[4];
  const ctaRow = updatedRows[6];
  const iconCardRows = updatedRows.slice(7);

  // Build cards section
  if (cardsHeadingRow && iconCardRows.length > 0) {
    const cardsSection = document.createElement('div');
    cardsSection.classList.add('cards-section');

    // Cards heading
    const cardsHeading = document.createElement('div');
    cardsHeading.classList.add('cards-heading');
    cardsHeading.innerHTML = cardsHeadingRow.querySelector('div')?.innerHTML || cardsHeadingRow.innerHTML;
    cardsSection.appendChild(cardsHeading);

    // Cards grid — each icon card row has 3 cells: icon, title, description
    const cardsGrid = document.createElement('div');
    cardsGrid.classList.add('cards-grid');

    iconCardRows.forEach((row) => {
      const cells = [...row.children];
      const card = document.createElement('div');
      card.classList.add('card');

      const iconCell = cells[0];
      if (iconCell) {
        const iconWrap = document.createElement('div');
        iconWrap.classList.add('card-icon');
        iconWrap.innerHTML = iconCell.innerHTML;
        card.appendChild(iconWrap);
      }

      // Title (cell 1) + description (cell 2) go into card-text
      if (cells[1] || cells[2]) {
        const textWrap = document.createElement('div');
        textWrap.classList.add('card-text');
        if (cells[1]) {
          const strong = document.createElement('p');
          strong.innerHTML = `<strong>${cells[1].textContent.trim()}</strong>`;
          textWrap.appendChild(strong);
        }
        if (cells[2]) {
          const p = document.createElement('p');
          p.textContent = cells[2].textContent.trim();
          textWrap.appendChild(p);
        }
        card.appendChild(textWrap);
      }

      cardsGrid.appendChild(card);
    });

    cardsSection.appendChild(cardsGrid);

    // Replace cards heading row with assembled section; remove icon rows
    cardsHeadingRow.replaceWith(cardsSection);
    iconCardRows.forEach((row) => row.remove());
  }

  // Tag disclaimer and CTA
  if (disclaimerRow) disclaimerRow.classList.add('disclaimer-row');
  if (ctaRow) ctaRow.classList.add('cta-row');

  // Remove empty spacer row
  if (updatedRows[5] && !updatedRows[5].textContent.trim()) {
    updatedRows[5].remove();
  }
}
