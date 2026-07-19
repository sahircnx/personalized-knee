/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-figure. Base: columns.
 * Source: https://www.thereadypatient.com/knee/knee-pain-explained.html
 *   (div.layout_container...:has(.cmp-image):not(:has(.cmp-image__title))...)
 * Columns block: first row = block name, second row = one cell per column.
 * A row of side-by-side images, no captions. Handles 2 images (typical) or 1 (variation).
 * Columns blocks take NO field hints — default content only.
 */
export default function parse(element, { document }) {
  // Each image sits in its own grid column; grab every cmp-image's <img>.
  const imgs = Array.from(element.querySelectorAll('.cmp-image img, .image img, img'))
    .filter((img, i, arr) => arr.indexOf(img) === i);

  // Empty-block guard
  if (imgs.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Second row: each image is its own column cell (no field hints for columns blocks).
  const row = imgs.map((img) => {
    const clone = document.createElement('img');
    clone.setAttribute('src', img.getAttribute('src') || '');
    clone.setAttribute('alt', img.getAttribute('alt') || '');
    return clone;
  });

  const cells = [row];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-figure', cells });
  element.replaceWith(block);
}
