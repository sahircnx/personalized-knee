// export default async function decorate(block) {
//   const rows = [...block.children];
//   if (rows.length < 2) return;

//   // First row is the header
//   const headerRow = rows[0];
//   headerRow.className = 'knee-stories-header';
//   // Flatten header: take content from first cell
//   const headerCell = headerRow.querySelector(':scope > div');
//   if (headerCell) {
//     headerRow.innerHTML = headerCell.innerHTML;
//   }

//   // Remaining rows are cards
//   const cardRows = rows.slice(1);

//   // Build cards from row data
//   const cards = cardRows.map((row) => {
//     const cells = [...row.children];
//     const imgCell = cells[0];
//     const textCell = cells[1];

//     const img = imgCell ? imgCell.querySelector('img') : null;
//     const bgSrc = img ? img.src : '';

//     const card = document.createElement('div');
//     card.className = 'knee-stories-card';
//     if (bgSrc) {
//       card.style.backgroundImage = `url('${bgSrc}')`;
//     }
//     if (textCell) {
//       card.innerHTML = textCell.innerHTML;
//     }
//     return card;
//   });

//   // Remove original card rows
//   cardRows.forEach((row) => row.remove());

//   // Create track with 3x duplication for infinite scroll
//   const track = document.createElement('div');
//   track.className = 'knee-stories-track';

//   for (let i = 0; i < 3; i += 1) {
//     cards.forEach((card) => {
//       track.appendChild(card.cloneNode(true));
//     });
//   }

//   block.appendChild(track);
// }
