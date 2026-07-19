/**
 * Author Bio — end-of-article author block for ReadyPatient knee articles.
 *
 * Structure (one row, two cells):
 *   cell 1 (identity): author portrait, name (linked), role, disclosure
 *   cell 2 (bio):      bio paragraph(s), "More by <author>" heading, link list
 *
 * Dedicated block (not based on the core columns component) so the layout and
 * styling can be tailored to the author-bio design.
 */
export default function decorate(block) {
  const row = block.firstElementChild;
  if (!row) return;

  const [identity, bio] = row.children;

  if (identity) {
    identity.classList.add('author-bio-identity');
    const pic = identity.querySelector('picture');
    if (pic) {
      const wrap = pic.closest('p') || pic.parentElement;
      if (wrap) wrap.classList.add('author-bio-avatar');
    }
    // name is the paragraph containing a <strong>; role/disclosure follow it
    const paras = [...identity.querySelectorAll('p')];
    const nameP = paras.find((p) => p.querySelector('strong'));
    if (nameP) nameP.classList.add('author-bio-name');
    const afterName = nameP ? paras.slice(paras.indexOf(nameP) + 1) : [];
    if (afterName[0]) afterName[0].classList.add('author-bio-role');
    if (afterName[1]) afterName[1].classList.add('author-bio-disclosure');
  }

  if (bio) {
    bio.classList.add('author-bio-content');
    const moreList = bio.querySelector('ul');
    if (moreList) moreList.classList.add('author-bio-more-list');
    const moreHeading = bio.querySelector('h1, h2, h3, h4, h5, h6');
    if (moreHeading) moreHeading.classList.add('author-bio-more-heading');
  }
}
