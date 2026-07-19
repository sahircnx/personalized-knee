/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: thereadypatient (ReadyPatient knee-article template) section breaks + metadata.
 *
 * Runs in afterTransform, after cleanup + block parsers. At this point blocks are
 * WebImporter *table* elements (first row = block name) and the source's AEM grid
 * wrappers are still in the DOM: the article is three `.wrapper` divs (header,
 * body, resource cards) nested under a shared `.responsivegrid` column.
 *
 * We anchor on the block tables, walk up to each block's enclosing `.wrapper`
 * ancestor (the section unit), and insert:
 *   - an <hr> before the body wrapper (section 2) and before the resource
 *     wrapper (section 3), and
 *   - a "Section Metadata" block (style=highlight) at the start of the resource
 *     wrapper (section 3).
 *
 * The <hr>/metadata are placed among the wrappers' shared parent so md2md emits
 * proper section breaks between Header / Body / "Here's more you can do".
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };
const MORE_HEADING_RE = /here'?s more you can do/i;

function blockName(node) {
  if (!node || node.tagName !== 'TABLE') return '';
  const cell = node.querySelector('tr td, tr th');
  return cell ? (cell.textContent || '').trim().toLowerCase() : '';
}

// Walk up from `node` to the enclosing section wrapper (a `.wrapper` div), or the
// highest ancestor still below `main` if no wrapper class is present.
function sectionWrapper(main, node) {
  let cur = node;
  let wrapper = null;
  while (cur && cur !== main) {
    if (cur.classList && cur.classList.contains('wrapper')) wrapper = cur;
    cur = cur.parentNode;
  }
  if (wrapper) return wrapper;
  // Fallback: highest ancestor directly under main.
  cur = node;
  while (cur && cur.parentNode && cur.parentNode !== main) cur = cur.parentNode;
  return cur;
}

export default function transform(hookName, element, payload) {
  if (hookName !== TransformHook.afterTransform) return;

  const doc = (payload && payload.document) || element.ownerDocument;
  const main = element || doc.body;
  if (!doc || !main) return;

  const tables = [...main.querySelectorAll('table')];
  const heroTable = tables.find((t) => blockName(t) === 'content hero article');
  const resourceTable = tables.find((t) => blockName(t) === 'cards resource');

  const insertHrBefore = (node) => {
    if (!node || !node.parentNode) return;
    if (node.previousElementSibling && node.previousElementSibling.tagName === 'HR') return;
    node.parentNode.insertBefore(doc.createElement('hr'), node);
  };

  // Section 3 — resource-cards wrapper (+ highlight metadata).
  let resourceWrapper = null;
  if (resourceTable) {
    resourceWrapper = sectionWrapper(main, resourceTable);
    const metadataBlock = WebImporter.Blocks.createBlock(doc, {
      name: 'Section Metadata',
      cells: { style: 'highlight' },
    });
    resourceWrapper.parentNode.insertBefore(metadataBlock, resourceWrapper);
    insertHrBefore(metadataBlock);
  }

  // Section 2 — Article Body. The body begins with the first content element
  // after the header hero (typically an H2 like "How the knee works"). Insert a
  // break before the first block/heading that comes after the hero table in
  // document order and is not inside the header or the resource section.
  if (heroTable) {
    const headerWrapper = sectionWrapper(main, heroTable);

    // Candidate body-start nodes: headings and block tables in document order.
    const candidates = [...main.querySelectorAll('h1, h2, h3, h4, h5, h6, table')];
    const afterHero = candidates.find((node) => {
      // strictly after the hero table
      if (!(heroTable.compareDocumentPosition(node) & 4 /* FOLLOWING */)) return false;
      // not part of the header wrapper
      if (headerWrapper.contains(node)) return false;
      // not part of the resource section
      if (resourceWrapper && resourceWrapper.contains(node)) return false;
      // not the resource heading itself
      if (/^H[1-6]$/.test(node.tagName) && MORE_HEADING_RE.test(node.textContent || '')) return false;
      return true;
    });

    if (afterHero) {
      // Break before the body-start node's own section wrapper if it has one,
      // else before the node itself.
      const bodyAnchor = sectionWrapper(main, afterHero) || afterHero;
      const anchor = (bodyAnchor && bodyAnchor !== headerWrapper && !headerWrapper.contains(bodyAnchor))
        ? bodyAnchor
        : afterHero;
      insertHrBefore(anchor);
    }
  }
}
