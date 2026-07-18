/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-author. Base: columns.
 * Source: https://www.thereadypatient.com/knee/knee-pain-explained.html (.author-bio)
 * Columns block: first row = block name, second row = one cell per column.
 * Two columns: (1) author identity — portrait + name/role/disclosure (linked),
 * (2) bio paragraph(s) + "More by <author>" list of article links.
 * Columns blocks take NO field hints — default content only.
 */
export default function parse(element, { document }) {
  const authorLinkEl = element.querySelector('a.author-header, .dv-author a[href], .author-bio-component a[href]');
  const nameEl = element.querySelector('.author-name');
  const roleEl = element.querySelector('.author-title');
  const disclosureEl = element.querySelector('.author-disclosure');
  const bioEl = element.querySelector('.bio-text');
  const moreEl = element.querySelector('.more-articles');
  const listEl = element.querySelector('ul.articles-list, .dv-links ul, ul');

  // Empty-block guard
  if (!nameEl && !bioEl) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const href = authorLinkEl ? (authorLinkEl.getAttribute('href') || '') : '';
  const nameText = nameEl ? nameEl.textContent.trim() : '';
  const roleText = roleEl ? roleEl.textContent.trim() : '';
  const disclosureText = disclosureEl ? disclosureEl.textContent.trim() : '';

  // Portrait background-image → <img>
  let img = null;
  const bgDiv = element.querySelector('.author-img, [class*="author-img"], [style*="background-image"]');
  if (bgDiv) {
    const style = bgDiv.getAttribute('style') || '';
    const m = style.match(/url\((['"]?)(.*?)\1\)/i);
    if (m && m[2]) {
      img = document.createElement('img');
      img.setAttribute('src', m[2]);
      img.setAttribute('alt', nameText);
    }
  }

  // Column 1: author identity, wrapped in the contributor link
  const col1 = document.createElement('div');
  const identityLink = document.createElement('a');
  identityLink.setAttribute('href', href);
  if (img) identityLink.appendChild(img);
  if (nameText) {
    const nm = document.createElement('p');
    nm.appendChild(document.createElement('strong')).textContent = nameText;
    identityLink.appendChild(nm);
  }
  col1.appendChild(identityLink);
  if (roleText) {
    const r = document.createElement('p');
    r.textContent = roleText;
    col1.appendChild(r);
  }
  if (disclosureText) {
    const d = document.createElement('p');
    d.appendChild(document.createElement('em')).textContent = disclosureText;
    col1.appendChild(d);
  }

  // Column 2: bio text + "More by" heading + article link list
  const col2 = document.createElement('div');
  if (bioEl) {
    Array.from(bioEl.querySelectorAll('p')).forEach((p) => {
      if (p.textContent.trim()) col2.appendChild(p.cloneNode(true));
    });
  }
  if (moreEl && moreEl.textContent.trim()) {
    const h = document.createElement('h4');
    h.textContent = moreEl.textContent.trim();
    col2.appendChild(h);
  }
  if (listEl) {
    const ul = document.createElement('ul');
    Array.from(listEl.querySelectorAll('li')).forEach((li) => {
      const srcA = li.querySelector('a[href]');
      const newLi = document.createElement('li');
      if (srcA) {
        const a = document.createElement('a');
        a.setAttribute('href', srcA.getAttribute('href') || '');
        a.textContent = srcA.textContent.trim();
        newLi.appendChild(a);
      } else {
        newLi.textContent = li.textContent.trim();
      }
      ul.appendChild(newLi);
    });
    if (ul.children.length) col2.appendChild(ul);
  }

  const cells = [[col1, col2]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-author', cells });
  element.replaceWith(block);
}
