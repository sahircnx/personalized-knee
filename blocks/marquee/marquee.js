export default async function decorate(block) {
  const rows = [...block.children];

  // Skip header rows (rows that have no image and only 1 col of text)
  // Card rows have an image in cell 0; header rows are plain text rows.
  const cardRows = rows.filter((row) => row.querySelector('img'));

  // Split cards into two tracks: first half → row 1, second half → row 2
  const midpoint = Math.ceil(cardRows.length / 2);
  const track1Cards = cardRows.slice(0, midpoint);
  const track2Cards = cardRows.slice(midpoint);

  function buildCard(row) {
    const cells = [...row.children];
    const card = document.createElement('div');
    card.className = 'marquee-card';

    // Cell 0: image (used as background)
    const imgCell = cells[0];
    const img = imgCell?.querySelector('img');
    if (img) {
      card.style.backgroundImage = `url(${img.src})`;
    }

    // Cell 1: title text
    // Cell 2: description text
    const titleCell = cells[1];
    const descCell = cells[2];
    if (titleCell || descCell) {
      const textDiv = document.createElement('div');
      textDiv.className = 'marquee-card-text';
      if (titleCell) {
        const h5 = document.createElement('h5');
        h5.textContent = titleCell.textContent.trim();
        textDiv.appendChild(h5);
      }
      if (descCell && descCell.textContent.trim()) {
        const p = document.createElement('p');
        p.textContent = descCell.textContent.trim();
        textDiv.appendChild(p);
      }
      card.appendChild(textDiv);
    }

    // Cell 3: link (convert to arrow button)
    const linkCell = cells[3];
    const link = linkCell?.querySelector('a');
    if (link) {
      const arrow = document.createElement('a');
      arrow.href = link.href;
      arrow.className = 'marquee-arrow';
      arrow.setAttribute('aria-label', link.textContent.trim() || 'Read more');
      card.appendChild(arrow);
    }

    return card;
  }

  function buildTrack(cards, reverse) {
    const track = document.createElement('div');
    track.className = `marquee-track${reverse ? ' reverse' : ''}`;

    // Build original cards
    const cardEls = cards.map((row) => buildCard(row));

    // Duplicate cards for seamless infinite scroll
    cardEls.forEach((card) => track.appendChild(card));
    cardEls.forEach((card) => track.appendChild(card.cloneNode(true)));

    return track;
  }

  // Clear block and rebuild
  block.textContent = '';

  const track1 = buildTrack(track1Cards, false);
  const track2 = buildTrack(track2Cards, true);

  block.appendChild(track1);
  block.appendChild(track2);

  // Pause on hover
  block.addEventListener('mouseenter', () => {
    block.querySelectorAll('.marquee-track').forEach((t) => {
      t.style.animationPlayState = 'paused';
    });
  });
  block.addEventListener('mouseleave', () => {
    block.querySelectorAll('.marquee-track').forEach((t) => {
      t.style.animationPlayState = 'running';
    });
  });
}
