export default async function decorate(block) {
  const rows = [...block.children];
  // rows[0] = hero image
  // rows[1] = hero heading
  // rows[2] = card 1 (Persona Knee)
  // rows[3] = card 2 (mymobility)
  // rows[4] = card 3 (ROSA)
  // rows[5] = bottom heading
  // rows[6] = CTA buttons

  // Build cards grid from rows 2-4
  const cardRows = [rows[2], rows[3], rows[4]];
  const cardsGrid = document.createElement('div');
  cardsGrid.className = 'ecosystem-cards-grid';

  // Left column: cards 1 and 2 stacked
  const leftCol = document.createElement('div');
  leftCol.className = 'ecosystem-cards-left';

  // Right column: card 3
  const rightCol = document.createElement('div');
  rightCol.className = 'ecosystem-cards-right';

  cardRows.forEach((row, index) => {
    const cells = [...row.children];
    // cells[0] = image, cells[1] = header text, cells[2] = footer text

    const card = document.createElement('div');
    card.className = 'eco-card';

    // Image as absolute background
    const imageDiv = document.createElement('div');
    imageDiv.className = 'eco-card-image';
    if (cells[0]) {
      imageDiv.append(...cells[0].childNodes);
    }
    card.appendChild(imageDiv);

    // Header text
    const headerDiv = document.createElement('div');
    headerDiv.className = 'eco-card-header';
    if (cells[1]) {
      headerDiv.append(...cells[1].childNodes);
    }
    card.appendChild(headerDiv);

    // Footer text
    if (cells[2]) {
      const footerDiv = document.createElement('div');
      footerDiv.className = 'eco-card-footer';
      footerDiv.append(...cells[2].childNodes);
      card.appendChild(footerDiv);
    }

    if (index < 2) {
      leftCol.appendChild(card);
    } else {
      rightCol.appendChild(card);
    }
  });

  cardsGrid.appendChild(leftCol);
  cardsGrid.appendChild(rightCol);

  // Remove original card rows and insert grid
  rows[2].replaceWith(cardsGrid);
  rows[3].remove();
  rows[4].remove();

  // Wrap bottom heading (rows[5]) and CTA buttons (rows[6]) in dark background wrapper
  const bottomWrapper = document.createElement('div');
  bottomWrapper.className = 'ecosystem-bottom';
  // At this point, rows[5] and rows[6] are still references to the original elements
  // They are now children 4 and 5 of the block (0-indexed: 3 and 4)
  const bottomHeading = block.children[3];
  const ctaButtons = block.children[4];
  if (bottomHeading) bottomWrapper.appendChild(bottomHeading);
  if (ctaButtons) bottomWrapper.appendChild(ctaButtons);
  block.appendChild(bottomWrapper);
}
