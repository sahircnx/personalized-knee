/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: thereadypatient (ReadyPatient knee-article template) section breaks + metadata.
 *
 * Runs in afterTransform only. Reads payload.template.sections and, in reverse order:
 *   - inserts a <hr> section break before every section except the first (when the
 *     section element is found and has content before it), and
 *   - inserts a "Section Metadata" block after any section that declares a `style`.
 *
 * knee-article template sections (from tools/importer/page-templates.json):
 *   1. section-1-article-header    style: null
 *   2. section-2-article-body      style: null
 *   3. section-3-more-you-can-do   style: "highlight"
 * => Expected: 2 <hr> breaks, 1 Section Metadata block (the "highlight" section).
 *
 * Section selectors come from the template data (validated against cleaned.html content grid).
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const doc = (payload && payload.document) || element.ownerDocument;
    const sections = payload && payload.template && payload.template.sections;
    if (!doc || !Array.isArray(sections) || sections.length < 2) {
      return;
    }

    // Resolve each section's anchor element within the migrated content.
    const resolved = sections.map((section) => {
      let el = null;
      if (section && section.selector) {
        // Selectors in the template are absolute (body > ...). Try scoped first, then document.
        el = element.querySelector(section.selector) || doc.querySelector(section.selector);
      }
      return { section, el };
    });

    // Process in reverse so inserting nodes does not shift later matches.
    for (let i = resolved.length - 1; i >= 0; i -= 1) {
      const { section, el } = resolved[i];
      if (!el) {
        // eslint-disable-next-line no-continue
        continue;
      }

      // Section Metadata block for sections that declare a style (e.g. "highlight").
      if (section && section.style) {
        const metadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (el.parentNode) {
          el.parentNode.insertBefore(metadataBlock, el.nextSibling);
        }
      }

      // Section break before every section except the first, when there is prior content.
      if (i > 0 && el.previousElementSibling) {
        const hr = doc.createElement('hr');
        if (el.parentNode) {
          el.parentNode.insertBefore(hr, el);
        }
      }
    }
  }
}
