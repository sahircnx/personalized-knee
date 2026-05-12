export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const cell = (idx) => rows[idx]?.firstElementChild || null;

  // Determine if row 0 is the 'classes' dropdown or the background image
  let contentStart = 0;
  if (cell(0) && !cell(0).querySelector('picture')) {
    const variant = cell(0).textContent.trim();
    if (variant && variant !== 'default') {
      block.classList.add(variant);
    }
    contentStart = 1;
  }

  const backgroundImageCell = cell(contentStart);
  const headingCell = cell(contentStart + 1);
  const descCell = cell(contentStart + 2);
  const disclaimerCell = cell(contentStart + 3);

  // ── Build DOM ──────────────────────────────────────────────────────────────
  const container = document.createElement('div');
  container.className = 'teaser-inner';

  // Heading
  if (headingCell?.textContent?.trim()) {
    const heading = document.createElement('h2');
    heading.className = 'teaser-heading';
    heading.textContent = headingCell.textContent.trim();
    container.append(heading);
  }

  // Description
  if (descCell?.innerHTML?.trim()) {
    const desc = document.createElement('div');
    desc.className = 'teaser-description';
    desc.innerHTML = descCell.innerHTML;
    container.append(desc);
  }

  // Disclaimer
  if (disclaimerCell?.innerHTML?.trim()) {
    const disclaimer = document.createElement('div');
    disclaimer.className = 'teaser-disclaimer';
    disclaimer.innerHTML = disclaimerCell.innerHTML;
    container.append(disclaimer);
  }

  // Actions (Default Button Block pattern + Legacy Support)
  const actions = document.createElement('div');
  actions.className = 'teaser-actions';
  
  const actionRows = rows.slice(contentStart + 4);
  for (let i = 0; i < actionRows.length; i += 1) {
    const row = actionRows[i];
    const rowCell = row.firstElementChild;
    if (!rowCell) continue;

    const links = [...rowCell.querySelectorAll('a')];
    if (links.length > 0) {
      // If the row has links, add them all
      links.forEach((link) => {
        actions.append(link.cloneNode(true));
      });
    } else {
      // If the row has NO links but has text, and the NEXT row has a link, 
      // treat this text as the label for the next row's first link.
      const label = rowCell.textContent.trim();
      const nextRow = actionRows[i + 1];
      const nextCell = nextRow?.firstElementChild;
      const nextLink = nextCell?.querySelector('a');
      
      if (label && nextLink) {
        const newLink = nextLink.cloneNode(true);
        newLink.textContent = label;
        actions.append(newLink);
        i += 1; // Skip the next row as we've consumed its link
      }
    }
  }

  // Decorate collected links
  [...actions.children].forEach((link, index) => {
    if (index === 0) {
      link.className = 'button primary teaser-primary-btn';
    } else {
      link.className = 'teaser-secondary-link';
    }
  });

  if (actions.children.length > 0) {
    container.append(actions);
  }

  // Background Image
  const picture = backgroundImageCell?.querySelector('picture');
  if (picture) {
    const bg = document.createElement('div');
    bg.className = 'teaser-bg';
    bg.append(picture);
    block.prepend(bg);
  }

  block.append(container);

  // Remove original rows
  rows.forEach((row) => row.remove());
}
