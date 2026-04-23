export default async function decorate(block) {
  const rows = [...block.children];

  // Row 0: heading
  // Row 1: body text
  // Row 2: gif image
  // Row 3: cards heading
  // Row 4: card pair 1 (icon, text, icon, text)
  // Row 5: card pair 2 (icon, text, icon, text)
  // Row 6: disclaimer
  // Row 7: CTA button

  // Build the cards section (rows 3-5)
  if (rows.length >= 6) {
    const cardsHeadingRow = rows[3];
    const cardRow1 = rows[4];
    const cardRow2 = rows[5];

    // Create the blue cards container
    const cardsSection = document.createElement('div');
    cardsSection.classList.add('cards-section');

    // Add the cards heading
    const cardsHeading = document.createElement('div');
    cardsHeading.classList.add('cards-heading');
    cardsHeading.innerHTML = cardsHeadingRow.querySelector('div').innerHTML;
    cardsSection.appendChild(cardsHeading);

    // Build the 2x2 grid
    const cardsGrid = document.createElement('div');
    cardsGrid.classList.add('cards-grid');

    // Process card pairs (each row has: icon, text, icon, text = 4 cells)
    [cardRow1, cardRow2].forEach((row) => {
      const cells = [...row.children];
      for (let i = 0; i < cells.length; i += 2) {
        const card = document.createElement('div');
        card.classList.add('card');

        const iconCell = cells[i];
        const textCell = cells[i + 1];

        if (iconCell) {
          const iconWrap = document.createElement('div');
          iconWrap.classList.add('card-icon');
          iconWrap.innerHTML = iconCell.innerHTML;
          card.appendChild(iconWrap);
        }

        if (textCell) {
          const textWrap = document.createElement('div');
          textWrap.classList.add('card-text');
          textWrap.innerHTML = textCell.innerHTML;
          card.appendChild(textWrap);
        }

        cardsGrid.appendChild(card);
      }
    });

    cardsSection.appendChild(cardsGrid);

    // Replace rows 3-5 with the cards section
    cardsHeadingRow.replaceWith(cardsSection);
    cardRow1.remove();
    cardRow2.remove();
  }

  // Tag specific rows for styling
  if (rows[0]) rows[0].classList.add('heading-row');
  if (rows[1]) rows[1].classList.add('body-row');
  if (rows[2]) rows[2].classList.add('gif-row');

  // Tag disclaimer and CTA (they shifted after removal)
  const remaining = [...block.children];
  const disclaimerRow = remaining.find((r) => r.querySelector('p') && r.textContent.includes('Not all patients'));
  if (disclaimerRow) disclaimerRow.classList.add('disclaimer-row');

  const ctaRow = remaining.find((r) => r.querySelector('a') && r.textContent.includes('Explore'));
  if (ctaRow) ctaRow.classList.add('cta-row');
}
