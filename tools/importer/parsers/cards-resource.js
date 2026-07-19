/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-resource. Base: cards.
 * Source: https://www.thereadypatient.com/knee/knee-pain-explained.html (.resource-grid-cards)
 * Container block: each row = one card [image cell, text cell] (empty cells still included).
 * child model `card` = { image (reference), text (richtext) }.
 * Resource cards have NO content image (background images are decorative), so the image
 *   cell is left empty but still present. The text cell holds H4 title + description + CTA link.
 * xwalk hints: empty image cell -> no field hint; field:text on the content cell.
 */
export default function parse(element, { document }) {
  const cardEls = Array.from(element.querySelectorAll('.card'));

  // Empty-block guard
  if (cardEls.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cardEls.forEach((cardEl) => {
    const heading = cardEl.querySelector('h4, .heading, [class*="heading"]');
    const desc = cardEl.querySelector('.rich-text, [class*="rich-text"]');
    const cta = cardEl.querySelector('a.button, .card__body a[href], a[href]');

    // image cell — empty (decorative background only); no field hint on empty cells
    const imageFrag = document.createDocumentFragment();

    // text cell — field:text: title + description + CTA
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    if (heading && heading.textContent.trim()) {
      const h = document.createElement('h4');
      h.textContent = heading.textContent.trim();
      textFrag.appendChild(h);
    }
    if (desc && desc.textContent.trim()) {
      const p = document.createElement('p');
      p.textContent = desc.textContent.trim();
      textFrag.appendChild(p);
    }
    if (cta) {
      const a = document.createElement('a');
      a.setAttribute('href', cta.getAttribute('href') || '');
      a.textContent = cta.textContent.trim();
      textFrag.appendChild(a);
    }

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-resource', cells });
  element.replaceWith(block);
}
