/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-article. Base: cards.
 * Source: https://www.thereadypatient.com/knee/knee-pain-explained.html
 *   (div.layout_container...:has(.article-card))
 * Container block: each row = one card [image cell, text cell] (empty cells still included).
 * child model `card` = { image (reference), text (richtext) }.
 * Each related-article card is an <a> with a CSS-background image (.imageQ) and a
 *   linked H4 title. The whole card links to another /knee/ article, so the text cell
 *   keeps the H4 wrapped in the article link.
 * xwalk hints: field:image, field:text (imageAlt collapses onto the <img>).
 * Only .article-card anchors are extracted; adjacent default-content .cmp-text is ignored.
 */
export default function parse(element, { document }) {
  const cardLinks = Array.from(element.querySelectorAll('a.article-card, .article-card a[href], a.article-card--mini-article'))
    .filter((a, i, arr) => arr.indexOf(a) === i);

  // Empty-block guard
  if (cardLinks.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const cells = [];

  cardLinks.forEach((cardLink) => {
    const href = cardLink.getAttribute('href') || '';
    const heading = cardLink.querySelector('h4, .article-title, [class*="article-title"]');
    const titleText = heading ? heading.textContent.trim() : (cardLink.textContent.trim() || href);

    // Background-image div → rebuild as <img>
    let img = null;
    const bgDiv = cardLink.querySelector('.imageQ, [class*="imageQ"], [style*="background-image"]');
    if (bgDiv) {
      const style = bgDiv.getAttribute('style') || '';
      const m = style.match(/url\((['"]?)(.*?)\1\)/i);
      if (m && m[2]) {
        img = document.createElement('img');
        img.setAttribute('src', m[2]);
        img.setAttribute('alt', titleText);
      }
    }

    // image cell — field:image (alt collapses onto the <img>)
    const imageFrag = document.createDocumentFragment();
    imageFrag.appendChild(document.createComment(' field:image '));
    if (img) imageFrag.appendChild(img);

    // text cell — field:text: linked H4 title (preserves the article link)
    const textFrag = document.createDocumentFragment();
    textFrag.appendChild(document.createComment(' field:text '));
    const h = document.createElement('h4');
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = titleText;
    h.appendChild(a);
    textFrag.appendChild(h);

    cells.push([imageFrag, textFrag]);
  });

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-article', cells });
  element.replaceWith(block);
}
