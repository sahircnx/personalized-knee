/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import contentHeroArticleParser from './parsers/content-hero-article.js';
import columnsFigureParser from './parsers/columns-figure.js';
import cardsFigureParser from './parsers/cards-figure.js';
import cardsArticleParser from './parsers/cards-article.js';
import columnsAuthorParser from './parsers/columns-author.js';
import cardsResourceParser from './parsers/cards-resource.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/thereadypatient-cleanup.js';
import sectionsTransformer from './transformers/thereadypatient-sections.js';

// PARSER REGISTRY
const parsers = {
  'content-hero-article': contentHeroArticleParser,
  'columns-figure': columnsFigureParser,
  'cards-figure': cardsFigureParser,
  'cards-article': cardsArticleParser,
  'columns-author': columnsAuthorParser,
  'cards-resource': cardsResourceParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'knee-article',
  description: 'ReadyPatient knee article page: article header, article body (rich text, image figures, captioned illustration group, related-article cards, author bio), and a closing resource cards section. Site header/footer excluded.',
  urls: [
    'https://www.thereadypatient.com/knee/knee-pain-explained.html',
  ],
  blocks: [
    {
      name: 'content-hero-article',
      instances: ['.article-header'],
    },
    {
      name: 'columns-figure',
      instances: ['div.layout_container.aem-GridColumn--default--6:has(.cmp-image):not(:has(.cmp-image__title)):not(:has(.article-card)):not(:has(.aem-GridColumn--offset--default--2))'],
    },
    {
      name: 'cards-figure',
      instances: ['div.layout_container.aem-GridColumn--default--6:has(.cmp-image__title)'],
    },
    {
      name: 'cards-article',
      instances: ['div.layout_container.aem-GridColumn--default--6:has(.article-card)'],
    },
    {
      name: 'columns-author',
      instances: ['.author-bio'],
    },
    {
      name: 'cards-resource',
      instances: ['.resource-grid-cards'],
      section: 'highlight',
    },
  ],
  sections: [
    {
      id: 'section-1-article-header',
      name: 'Article Header',
      selector: '.article-header',
      style: null,
      blocks: ['content-hero-article'],
      defaultContent: [],
    },
    {
      id: 'section-2-article-body',
      name: 'Article Body',
      selector: 'body > div.root.responsivegrid > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.wrapper:nth-of-type(2)',
      style: null,
      blocks: ['columns-figure', 'cards-figure', 'cards-article', 'columns-author'],
      defaultContent: ['.text .cmp-text', '.button > a.button--center'],
    },
    {
      id: 'section-3-more-you-can-do',
      name: "Here's more you can do",
      selector: 'body > div.root.responsivegrid > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.wrapper:nth-of-type(3)',
      style: 'highlight',
      blocks: ['cards-resource'],
      defaultContent: ['.title .cmp-title > h3'],
    },
  ],
};

// TRANSFORMER REGISTRY - cleanup first, then section breaks/metadata
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };

  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];

  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      let elements;
      try {
        elements = document.querySelectorAll(selector);
      } catch (e) {
        console.warn(`Invalid selector for block "${blockDef.name}": ${selector}`, e);
        return;
      }
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });

  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const {
      document, url, html, params,
    } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return; // Already replaced by an earlier parser
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
