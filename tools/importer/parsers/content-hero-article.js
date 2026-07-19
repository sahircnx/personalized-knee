/* eslint-disable */
/* global WebImporter */
/**
 * Parser for content-hero-article. Base: content-hero.
 * Source: https://www.thereadypatient.com/knee/knee-pain-explained.html (.article-header)
 * Simple xwalk block (1 column). One row per model field (collapsed suffixes fold in).
 * Model fields: eyebrow, title, intro, readTime, authorImage(+Alt), authorName,
 *   authorRole, authorDisclosure, authorLink.
 * Note: the breadcrumb inside .article-header is removed by the cleanup transformer,
 *   so no selector depends on it.
 */
export default function parse(element, { document }) {
  // Eyebrow / category label
  const eyebrow = element.querySelector('.article-tag, .tag-locator, [class*="article-tag"]');

  // Title (H1)
  const title = element.querySelector('h1.story-title, h1[data-story-title], h1');

  // Intro rich text
  const intro = element.querySelector('.info .rich-text, .rich-text');

  // Read time — the date/read-time indicator lives in .author-info .date
  const dateEl = element.querySelector('.author-info .date, .date');
  const readTime = dateEl ? (dateEl.textContent || '').replace(/\|/g, '').trim() : '';

  // Author byline
  const authorLink = element.querySelector('a.author-slug, .author-info a[href], .author-info a');
  const authorName = element.querySelector('.author-name, [data-author-tag]');
  const authorRole = element.querySelector('.author-title');
  const authorDisclosure = element.querySelector('.author-disclosure');

  // Portrait image is a decorative CSS background on .author-img; rebuild as <img>
  let authorImg = null;
  const authorImgDiv = element.querySelector('.author-img, [class*="author-img"]');
  if (authorImgDiv) {
    const style = authorImgDiv.getAttribute('style') || '';
    const m = style.match(/url\((['"]?)(.*?)\1\)/i);
    if (m && m[2]) {
      authorImg = document.createElement('img');
      authorImg.setAttribute('src', m[2]);
      authorImg.setAttribute('alt', authorName ? authorName.textContent.trim() : '');
    }
  }

  // Empty-block guard
  if (!title && !intro && !authorName) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Helper to build a single-column cell with a field hint before its content
  const hintCell = (fieldName, content) => {
    const frag = document.createDocumentFragment();
    frag.appendChild(document.createComment(` field:${fieldName} `));
    if (typeof content === 'string') {
      frag.appendChild(document.createTextNode(content));
    } else if (content) {
      frag.appendChild(content);
    }
    return frag;
  };

  const cells = [];

  // eyebrow
  cells.push([hintCell('eyebrow', eyebrow ? eyebrow.textContent.trim() : '')]);
  // title
  cells.push([hintCell('title', title ? title.textContent.trim() : '')]);
  // intro (richtext — keep markup)
  cells.push([hintCell('intro', intro)]);
  // readTime
  cells.push([hintCell('readTime', readTime)]);
  // authorImage (reference; Alt is collapsed onto the img, no hint for alt)
  cells.push([hintCell('authorImage', authorImg)]);
  // authorName
  cells.push([hintCell('authorName', authorName ? authorName.textContent.trim() : '')]);
  // authorRole
  cells.push([hintCell('authorRole', authorRole ? authorRole.textContent.trim() : '')]);
  // authorDisclosure
  cells.push([hintCell('authorDisclosure', authorDisclosure ? authorDisclosure.textContent.trim() : '')]);
  // authorLink (aem-content — keep the anchor with href)
  let linkContent = null;
  if (authorLink) {
    const a = document.createElement('a');
    a.setAttribute('href', authorLink.getAttribute('href') || '');
    a.textContent = authorName ? authorName.textContent.trim() : (authorLink.textContent.trim() || authorLink.getAttribute('href') || '');
    linkContent = a;
  }
  cells.push([hintCell('authorLink', linkContent)]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'content-hero-article', cells });
  element.replaceWith(block);
}
