/**
 * Content Hero block  split layout (text left, image right).
 *
 * Expected block structure (two cells in one row):
 *   Row 0, Cell 0  text content (eyebrow strong, h1, h5, CTA link)
 *   Row 0, Cell 1  image (picture / img)
 */
export default function decorate(block) {
  const row = block.querySelector(':scope > div');
  if (!row) return;

  const cells = [...row.querySelectorAll(':scope > div')];
  const textCell = cells[0];
  const imageCell = cells[1];

  if (textCell) {
    textCell.classList.add('content-hero-text');

    // Eyebrow: first <p> whose sole content is a <strong>
    const firstP = textCell.querySelector('p:first-child');
    if (firstP && firstP.querySelector('strong') && firstP.textContent.trim() === firstP.querySelector('strong').textContent.trim()) {
      firstP.classList.add('content-hero-eyebrow');
    }

    // Promote links inside the text cell to buttons
    textCell.querySelectorAll('a').forEach((a) => {
      a.classList.add('button');
    });
  }

  if (imageCell) {
    imageCell.classList.add('content-hero-image');
  }
}
