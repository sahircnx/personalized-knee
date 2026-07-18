/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: thereadypatient (ReadyPatient knee-article template) site-wide cleanup.
 *
 * Scope goal (from migration-work/page-structure.json .scope and .contentGridSelector):
 *   Keep ONLY the article-body content grid (.root.responsivegrid content grid).
 *   Exclude the site header/navigation experience fragment (top) and the site
 *   footer experience fragment (legal text, footer nav, copyright) — these are
 *   auto-populated site-wide in EDS and must not be part of imported article content.
 *
 * All selectors below are validated against migration-work/cleaned.html (the sanitized
 * source DOM for https://www.thereadypatient.com/knee/knee-pain-explained.html) unless
 * noted as chrome that lives outside the captured content grid on the live page.
 */

const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

// Content grid selector — verified in cleaned.html / page-structure.json .contentGridSelector.
// This is the meaningful article content (the middle content grid).
const CONTENT_GRID_SELECTOR = 'div.root.responsivegrid > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12';

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // OneTrust cookie-consent SDK — non-authorable site chrome. Remove the banner/SDK
    // containers so they never reach the parsers (found on the live page shell, not in
    // the scoped cleaned.html). Selectors are the standard OneTrust container ids.
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#onetrust-banner-sdk',
      '#ot-sdk-btn-floating',
    ]);

    // Non-content chrome the analysis marked as dropped (all found in cleaned.html):
    //  - .utility-bar         : share/print/embed/copy-link icon bar (s2-seq1)
    //  - .breadcrumb-zb / .cmp-breadcrumb : breadcrumb navigation (s1-seq2)
    //  - .useful-rating       : interactive article-rating star widget (s2-seq20)
    // Removed in beforeTransform so block parsers never see them. No block-mapping
    // selector in page-templates.json depends on any of these.
    WebImporter.DOMUtils.remove(element, [
      '.utility-bar',
      '.breadcrumb-zb',
      '.cmp-breadcrumb',
      '.useful-rating',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Keep ONLY the article-body content grid. On the live URL used by the validator,
    // the site header/nav experience fragment and the site footer experience fragment
    // (legal text, footer nav, copyright) sit OUTSIDE this grid; reducing `element` to
    // the content grid subtree drops them without needing to guess their selectors.
    const contentGrid = element.querySelector(CONTENT_GRID_SELECTOR);
    if (contentGrid) {
      // Replace all of element's children with just the content grid, preserving `element`.
      element.replaceChildren(contentGrid);
    }

    // Belt-and-suspenders: if any global chrome still exists (e.g. header/footer landmarks
    // present on the live page), remove it. These are non-authorable, site-wide, auto-
    // populated in EDS. Content-grid content contains none of these landmark elements.
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
    ]);

    // Remove leftover non-authorable / decorative elements the parsers do not need.
    //  - svg / use : icon glyphs (stopwatch byline icon, resource-card decoration) — decorative only
    //  - script / noscript / link / style : never authorable content
    WebImporter.DOMUtils.remove(element, [
      'svg',
      'use',
      'script',
      'noscript',
      'link',
      'style',
    ]);
  }
}
