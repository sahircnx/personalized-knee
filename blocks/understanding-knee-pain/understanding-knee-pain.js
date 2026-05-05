export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // If there's only one row and it has 1 column, it might be the old format,
  // but let's assume the new xwalk format where the first row contains main properties
  // and subsequent rows contain cards.

  let mainRow;
  let cardRows = [];

  // Check if first row is the new model format (multiple cells)
  if (rows[0].children.length > 1) {
    mainRow = rows[0];
    cardRows = rows.slice(1);
  } else if (rows.length === 7 && rows.every(r => r.children.length === 1)) {
    // Legacy mapping (just in case)
    mainRow = document.createElement('div');
    // Row 0: Eyebrow, 1: Heading, 2: DescIcon, 3: Desc, 4: Link, 5: Image, 6: Overlay
    mainRow.append(
      rows[5].cloneNode(true), // Image
      rows[6].cloneNode(true), // Overlay
      document.createElement('div'), // Position
      rows[0].cloneNode(true), // Eyebrow
      rows[1].cloneNode(true), // Heading
      rows[3].cloneNode(true), // Desc
      rows[4].cloneNode(true), // Link
      document.createElement('div')  // LinkText
    );
  } else {
    // Default to first row being main, rest cards
    mainRow = rows[0];
    cardRows = rows.slice(1);
  }

  const cells = mainRow.children;
  const imageCell = cells[0];
  const overlayCell = cells[1];
  const positionCell = cells[2];
  const eyebrowCell = cells[3];
  const headingCell = cells[4];
  const descCell = cells[5];
  const linkCell = cells[6];
  const linkTextCell = cells[7];

  // Clear block
  block.textContent = '';

  // Create layout
  const container = document.createElement('div');
  container.className = 'understanding-knee-pain-container';

  const textCol = document.createElement('div');
  textCol.className = 'understanding-knee-pain-text-col';

  const imageCol = document.createElement('div');
  imageCol.className = 'understanding-knee-pain-image-col';

  // Position
  const position = positionCell?.textContent?.trim().toLowerCase() || 'left';
  if (position === 'left') {
    container.classList.add('image-left');
  } else {
    container.classList.add('image-right');
  }

  // Eyebrow
  if (eyebrowCell && eyebrowCell.textContent.trim()) {
    const eyebrow = document.createElement('p');
    eyebrow.className = 'understanding-knee-pain-eyebrow';
    eyebrow.textContent = eyebrowCell.textContent.trim();
    textCol.append(eyebrow);
  }

  // Heading
  if (headingCell && headingCell.textContent.trim()) {
    const heading = document.createElement('h2');
    heading.className = 'understanding-knee-pain-heading';
    heading.textContent = headingCell.textContent.trim();
    textCol.append(heading);
  }

  // Description
  if (descCell && descCell.textContent.trim()) {
    const desc = document.createElement('div');
    desc.className = 'understanding-knee-pain-description-main';
    desc.innerHTML = descCell.innerHTML;
    textCol.append(desc);
  }

  // Cards
  if (cardRows.length > 0) {
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'understanding-knee-pain-cards';
    
    cardRows.forEach(row => {
      const iconCell = row.children[0];
      const titleCell = row.children[1];
      const cardDescCell = row.children[2];
      
      const card = document.createElement('div');
      card.className = 'understanding-knee-pain-card';
      
      if (iconCell && iconCell.querySelector('picture')) {
        const icon = iconCell.querySelector('picture');
        icon.classList.add('understanding-knee-pain-card-icon');
        card.append(icon);
      }
      
      const textContainer = document.createElement('div');
      textContainer.className = 'understanding-knee-pain-card-text';
      
      if (titleCell && titleCell.textContent.trim()) {
        const title = document.createElement('h5');
        title.className = 'understanding-knee-pain-card-title';
        title.textContent = titleCell.textContent.trim();
        textContainer.append(title);
      }
      
      if (cardDescCell && cardDescCell.textContent.trim()) {
        const desc = document.createElement('div');
        desc.className = 'understanding-knee-pain-card-desc';
        desc.innerHTML = cardDescCell.innerHTML;
        textContainer.append(desc);
      }
      
      if (textContainer.children.length > 0) {
        card.append(textContainer);
      }
      
      cardsContainer.append(card);
    });
    
    textCol.append(cardsContainer);
  }

  // Link / Button
  if (linkCell && linkCell.querySelector('a')) {
    const link = linkCell.querySelector('a');
    link.className = 'understanding-knee-pain-button button secondary outline';
    if (linkTextCell && linkTextCell.textContent.trim()) {
      link.textContent = linkTextCell.textContent.trim();
    }
    textCol.append(link);
  }

  // Image
  if (imageCell && imageCell.querySelector('picture')) {
    const picture = imageCell.querySelector('picture');
    picture.classList.add('understanding-knee-pain-main-image');
    imageCol.append(picture);
  }

  // Overlay
  if (overlayCell && overlayCell.textContent.trim()) {
    const overlay = document.createElement('div');
    overlay.className = 'understanding-knee-pain-overlay';
    overlay.innerHTML = overlayCell.innerHTML;
    imageCol.append(overlay);
  }

  // Append columns based on position
  if (position === 'right') {
    container.append(textCol);
    container.append(imageCol);
  } else {
    container.append(imageCol);
    container.append(textCol);
  }

  block.append(container);
}
