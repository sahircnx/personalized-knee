export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Parse the layout structure based on how Universal Editor or manual authoring structures it.
  let imageCell, overlayCell, positionCell, eyebrowCell, headingCell, descCell, linkCell, linkTextCell;
  let cardRows = [];

  if (rows.length === 1 && rows[0].children.length === 2) {
    // Legacy `columns` format (1 row, 2 columns)
    const left = rows[0].children[0];
    const right = rows[0].children[1];
    imageCell = left;
    
    overlayCell = document.createElement('div');
    const em = left.querySelector('em');
    if (em) overlayCell.textContent = em.textContent;
    
    eyebrowCell = document.createElement('div');
    const strong = right.querySelector('p > strong');
    if (strong) eyebrowCell.textContent = strong.textContent;
    
    headingCell = right.querySelector('h1, h2, h3, h4, h5, h6');
    
    descCell = document.createElement('div');
    let el = headingCell ? headingCell.nextElementSibling : right.firstElementChild;
    while (el && el.tagName !== 'H5' && el.tagName !== 'A' && !el.querySelector('a')) {
      descCell.appendChild(el.cloneNode(true));
      el = el.nextElementSibling;
    }
    
    while (el && el.tagName === 'H5') {
      const cardTitle = el.cloneNode(true);
      const cardDesc = el.nextElementSibling && el.nextElementSibling.tagName === 'P' ? el.nextElementSibling.cloneNode(true) : document.createElement('p');
      const row = document.createElement('div');
      row.append(document.createElement('div'), cardTitle, cardDesc);
      cardRows.push(row);
      el = el.nextElementSibling;
      if (el && el.tagName === 'P') el = el.nextElementSibling;
    }
    
    linkCell = right.querySelector('a') ? right.querySelector('a').parentElement : null;
    linkTextCell = document.createElement('div');
    if (linkCell && linkCell.querySelector('a')) linkTextCell.textContent = linkCell.textContent;
    
  } else if (rows.length === 7) {
    // Legacy understanding-knee-pain format (7 rows)
    const getCell = (idx) => rows[idx];
    eyebrowCell = getCell(0);
    headingCell = getCell(1);
    descCell = getCell(3);
    linkCell = getCell(4);
    imageCell = getCell(5);
    overlayCell = getCell(6);
    cardRows = [];
  } else if (rows.length >= 8) {
    // Universal Editor format: 8 main fields as the first 8 rows.
    // In UE, if a row is a rich text field without a column wrapper, the row itself is the cell.
    const getCell = (idx) => {
      if (rows[idx].children.length === 1 && rows[idx].firstElementChild.tagName === 'DIV') {
        return rows[idx].children[0];
      }
      return rows[idx];
    };
    
    imageCell = getCell(0);
    overlayCell = getCell(1);
    positionCell = getCell(2);
    eyebrowCell = getCell(3);
    headingCell = getCell(4);
    descCell = getCell(5);
    linkCell = getCell(6);
    linkTextCell = getCell(7);
    
    // Any rows after the first 8 are cards
    cardRows = rows.slice(8);
  } else {
    // Fallback if rows.length < 7
    imageCell = rows[0];
  }

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
    
    // If cardRows are all single-column, they might be flattened item fields (Icon, Title, Desc)
    if (cardRows.every(r => r.children.length <= 1)) {
      const grouped = [];
      for (let i = 0; i < cardRows.length; i += 3) {
        const row = document.createElement('div');
        row.append(
          cardRows[i] || document.createElement('div'),
          cardRows[i+1] || document.createElement('div'),
          cardRows[i+2] || document.createElement('div')
        );
        grouped.push(row);
      }
      cardRows = grouped;
    }
    
    cardRows.forEach(row => {
      const iconCell = row.children[0];
      const titleCell = row.children[1];
      const cardDescCell = row.children[2];
      
      const card = document.createElement('div');
      card.className = 'understanding-knee-pain-card';
      
      if (iconCell) {
        const icon = iconCell.tagName === 'PICTURE' ? iconCell : iconCell.querySelector('picture');
        if (icon) {
          const pic = icon.cloneNode(true);
          pic.classList.add('understanding-knee-pain-card-icon');
          card.append(pic);
        }
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
        desc.innerHTML = cardDescCell.tagName === 'DIV' ? cardDescCell.innerHTML : cardDescCell.outerHTML;
        textContainer.append(desc);
      }
      
      if (textContainer.children.length > 0) {
        card.append(textContainer);
      }
      
      if (card.children.length > 0) {
        cardsContainer.append(card);
      }
    });
    
    if (cardsContainer.children.length > 0) {
      textCol.append(cardsContainer);
    }
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

  // Append columns (always image first so it's on top in mobile)
  container.append(imageCol);
  container.append(textCol);

  block.append(container);
}
