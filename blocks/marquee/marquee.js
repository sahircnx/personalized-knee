export default async function decorate(block) {
  const rows = [...block.children];

  // Split rows into two tracks: first 3 cards → row 1, next 3 → row 2
  const midpoint = Math.ceil(rows.length / 2);
  const track1Cards = rows.slice(0, midpoint);
  const track2Cards = rows.slice(midpoint);

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

    // Cell 1: text content (h5 + p)
    const textCell = cells[1];
    if (textCell) {
      const textDiv = document.createElement('div');
      textDiv.className = 'marquee-card-text';
      textDiv.innerHTML = textCell.innerHTML;
      card.appendChild(textDiv);
    }

    // Cell 2: link (convert to arrow button)
    const linkCell = cells[2];
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
