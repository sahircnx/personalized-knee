export default async function decorate(block) {
  const rows = [...block.children];
  const headerRow = rows[0];
  const cardRows = rows.slice(1);

  // Build card elements from authored rows
  const cards = cardRows.map((row) => {
    const cells = [...row.children];
    const imgCell = cells[0];
    const textCell = cells[1];

    const img = imgCell?.querySelector('img');
    const card = document.createElement('div');
    card.className = 'card';
    if (img) {
      card.style.backgroundImage = `url('${img.src}')`;
    }

    const textWrapper = document.createElement('div');
    textWrapper.className = 'card-text';
    if (textCell) {
      textWrapper.innerHTML = textCell.innerHTML;
    }
    card.appendChild(textWrapper);
    return card;
  });

  // Remove original card rows
  cardRows.forEach((row) => row.remove());

  // Create marquee track with duplicated cards for infinite scroll
  const track = document.createElement('div');
  track.className = 'cards-track';

  // Add cards 3 times for seamless looping
  for (let i = 0; i < 3; i += 1) {
    cards.forEach((card) => {
      track.appendChild(card.cloneNode(true));
    });
  }

  block.appendChild(track);
}
