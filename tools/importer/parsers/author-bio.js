/* eslint-disable */
/* global WebImporter */
/**
 * Parser for author-bio (dedicated block; NOT based on core columns).
 * Source: thereadypatient.com knee articles (.author-bio).
 * One row, two cells:
 *   cell 1 (field:identity) — portrait + name (linked) + role + disclosure
 *   cell 2 (field:bio)      — bio paragraph(s) + "More by" heading + link list
 */
export default function parse(element, { document }) {
  const authorLinkEl = element.querySelector('a.author-header, .dv-author a[href], .author-bio-component a[href]');
  const nameEl = element.querySelector('.author-name');
  const roleEl = element.querySelector('.author-title');
  const disclosureEl = element.querySelector('.author-disclosure');
  const bioEl = element.querySelector('.bio-text');
  const moreEl = element.querySelector('.more-articles');
  const listEl = element.querySelector('ul.articles-list, .dv-links ul, ul');

  if (!nameEl && !bioEl) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const href = authorLinkEl ? (authorLinkEl.getAttribute('href') || '') : '';
  const nameText = nameEl ? nameEl.textContent.trim() : '';
  const roleText = roleEl ? roleEl.textContent.trim() : '';
  const disclosureText = disclosureEl ? disclosureEl.textContent.trim() : '';

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

  // Cell 1: identity (field:identity)
  const identity = document.createElement('div');
  const identityHint = document.createComment(' field:identity ');
  identity.appendChild(identityHint);
  if (img) {
    const picP = document.createElement('p');
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.appendChild(img);
    picP.appendChild(a);
    identity.appendChild(picP);
  }
  if (nameText) {
    const nm = document.createElement('p');
    const strong = document.createElement('strong');
    const a = document.createElement('a');
    a.setAttribute('href', href);
    a.textContent = nameText;
    strong.appendChild(a);
    nm.appendChild(strong);
    identity.appendChild(nm);
  }
  if (roleText) {
    const r = document.createElement('p');
    r.textContent = roleText;
    identity.appendChild(r);
  }
  if (disclosureText) {
    const d = document.createElement('p');
    d.appendChild(document.createElement('em')).textContent = disclosureText;
    identity.appendChild(d);
  }

  // Cell 2: bio + more-by list (field:bio)
  const bio = document.createElement('div');
  const bioHint = document.createComment(' field:bio ');
  bio.appendChild(bioHint);
  if (bioEl) {
    Array.from(bioEl.querySelectorAll('p')).forEach((p) => {
      if (p.textContent.trim()) bio.appendChild(p.cloneNode(true));
    });
  }
  if (moreEl && moreEl.textContent.trim()) {
    const h = document.createElement('h4');
    h.textContent = moreEl.textContent.trim();
    bio.appendChild(h);
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
    if (ul.children.length) bio.appendChild(ul);
  }

  // Two single-cell rows (one per model field) so md2jcr emits field-hinted
  // rows for the modeled block, not a 2-column columns-style table.
  const cells = [[identity], [bio]];
  const block = WebImporter.Blocks.createBlock(document, { name: 'Author Bio', cells });
  element.replaceWith(block);
}
