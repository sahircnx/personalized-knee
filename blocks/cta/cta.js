export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // 1. Map Universal Editor flat structure to cells
  // If a row has only one child and it's a div, that's our content cell
  const getCell = (idx) => {
    if (!rows[idx]) return null;
    if (rows[idx].children.length === 1 && rows[idx].firstElementChild.tagName === 'DIV') {
      return rows[idx].children[0];
    }
    return rows[idx];
  };

  const backgroundImageCell = getCell(0);
  const headingCell = getCell(1);
  const descCell = getCell(2);
  const disclaimerCell = getCell(3);
  const primaryBtnTextCell = getCell(4);
  const primaryBtnLinkCell = getCell(5);
  const secondaryLinkTextCell = getCell(6);
  const secondaryLinkUrlCell = getCell(7);

  // Clear existing DOM
  block.textContent = '';

  // 2. Build DOM
  const container = document.createElement('div');
  container.className = 'cta-container';

  // Background Image
  if (backgroundImageCell && backgroundImageCell.querySelector('picture')) {
    const picture = backgroundImageCell.querySelector('picture');
    picture.classList.add('cta-background');
    block.append(picture);
  }

  // Heading
  if (headingCell && headingCell.textContent.trim()) {
    const heading = document.createElement('h2');
    heading.className = 'cta-heading';
    heading.textContent = headingCell.textContent.trim();
    container.append(heading);
  }

  // Description
  if (descCell && descCell.textContent.trim()) {
    const desc = document.createElement('div');
    desc.className = 'cta-description';
    desc.innerHTML = descCell.innerHTML;
    container.append(desc);
  }

  // Disclaimer
  if (disclaimerCell && disclaimerCell.textContent.trim()) {
    const disclaimer = document.createElement('div');
    disclaimer.className = 'cta-disclaimer';
    disclaimer.innerHTML = disclaimerCell.innerHTML;
    container.append(disclaimer);
  }

  // Actions Container
  const actionsContainer = document.createElement('div');
  actionsContainer.className = 'cta-actions';

  // Primary Button
  if (primaryBtnLinkCell && primaryBtnLinkCell.textContent.trim()) {
    let url = primaryBtnLinkCell.textContent.trim();
    // Support aem-content component outputs (which often contain links inside)
    if (primaryBtnLinkCell.querySelector('a')) {
      url = primaryBtnLinkCell.querySelector('a').href;
    }
    const button = document.createElement('a');
    button.href = url;
    button.className = 'button primary cta-primary-btn';
    button.textContent = primaryBtnTextCell && primaryBtnTextCell.textContent.trim() 
      ? primaryBtnTextCell.textContent.trim() 
      : 'Learn More';
    actionsContainer.append(button);
  }

  // Secondary Link
  if (secondaryLinkUrlCell && secondaryLinkUrlCell.textContent.trim()) {
    let url = secondaryLinkUrlCell.textContent.trim();
    if (secondaryLinkUrlCell.querySelector('a')) {
      url = secondaryLinkUrlCell.querySelector('a').href;
    }
    const secLink = document.createElement('a');
    secLink.href = url;
    secLink.className = 'cta-secondary-link';
    secLink.textContent = secondaryLinkTextCell && secondaryLinkTextCell.textContent.trim()
      ? secondaryLinkTextCell.textContent.trim()
      : 'Learn More';
    actionsContainer.append(secLink);
  }

  if (actionsContainer.children.length > 0) {
    container.append(actionsContainer);
  }

  block.append(container);
}
