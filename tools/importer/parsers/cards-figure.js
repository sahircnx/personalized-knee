/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-figure. Base: cards.
 * Source: https://www.thereadypatient.com/knee/knee-pain-explained.html
 *   (div.layout_container...:has(.cmp-image__title))
 * Container block: each row = one card [image cell, text cell] (empty cells still included).
 * child model `card` = { image (reference), text (richtext) }.
 * Each captioned illustration = one row. xwalk hints: field:image, field:text
 *   (imageAlt collapses onto the <img>).
 */
export default function parse(element, { document }) {
  const cardEls = Array.from(element.querySelectorAll('.cmp-image'));

  // Empty-block guard
  if (cardEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cardEls.forEach((cardEl) => {
    const srcImg = cardEl.querySelector('img');
    const caption = cardEl.querySelector('.cmp-image__title, [itemprop="caption"]');
    const captionText = caption ? caption.textContent.trim() : '';

    // image cell — field:image, alt collapses onto the <img> (no field:imageAlt hint)
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    if (srcImg) {
      const img = document.createElement('img');
      img.setAttribute('src', srcImg.getAttribute('src') || '');
      img.setAttribute('alt', srcImg.getAttribute('alt') || captionText);
      imageFrag.appendChild(img);
    }

    // text cell — field:text (the caption)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (captionText) {
      const p = document.createElement('p');
      p.textContent = captionText;
      textFrag.appendChild(p);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-figure', cells });
  element.replaceWith(block);
}
