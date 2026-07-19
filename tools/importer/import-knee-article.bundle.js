/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-knee-article.js
  var import_knee_article_exports = {};
  __export(import_knee_article_exports, {
    default: () => import_knee_article_default
  });

  // tools/importer/parsers/content-hero-article.js
  function parse(element, { document }) {
    const eyebrow = element.querySelector('.article-tag, .tag-locator, [class*="article-tag"]');
    const title = element.querySelector("h1.story-title, h1[data-story-title], h1");
    const intro = element.querySelector(".info .rich-text, .rich-text");
    const dateEl = element.querySelector(".author-info .date, .date");
    const readTime = dateEl ? (dateEl.textContent || "").replace(/\|/g, "").trim() : "";
    const authorLink = element.querySelector("a.author-slug, .author-info a[href], .author-info a");
    const authorName = element.querySelector(".author-name, [data-author-tag]");
    const authorRole = element.querySelector(".author-title");
    const authorDisclosure = element.querySelector(".author-disclosure");
    let authorImg = null;
    const authorImgDiv = element.querySelector('.author-img, [class*="author-img"]');
    if (authorImgDiv) {
      const style = authorImgDiv.getAttribute("style") || "";
      const m = style.match(/url\((['"]?)(.*?)\1\)/i);
      if (m && m[2]) {
        authorImg = document.createElement("img");
        authorImg.setAttribute("src", m[2]);
        authorImg.setAttribute("alt", authorName ? authorName.textContent.trim() : "");
      }
    }
    if (!title && !intro && !authorName) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const hintCell = (fieldName, content) => {
      const frag = document.createDocumentFragment();
      frag.appendChild(document.createComment(` field:${fieldName} `));
      if (typeof content === "string") {
        frag.appendChild(document.createTextNode(content));
      } else if (content) {
        frag.appendChild(content);
      }
      return frag;
    };
    const cells = [];
    cells.push([hintCell("eyebrow", eyebrow ? eyebrow.textContent.trim() : "")]);
    cells.push([hintCell("title", title ? title.textContent.trim() : "")]);
    cells.push([hintCell("intro", intro)]);
    cells.push([hintCell("readTime", readTime)]);
    cells.push([hintCell("authorImage", authorImg)]);
    cells.push([hintCell("authorName", authorName ? authorName.textContent.trim() : "")]);
    cells.push([hintCell("authorRole", authorRole ? authorRole.textContent.trim() : "")]);
    cells.push([hintCell("authorDisclosure", authorDisclosure ? authorDisclosure.textContent.trim() : "")]);
    let linkContent = null;
    if (authorLink) {
      const a = document.createElement("a");
      a.setAttribute("href", authorLink.getAttribute("href") || "");
      a.textContent = authorName ? authorName.textContent.trim() : authorLink.textContent.trim() || authorLink.getAttribute("href") || "";
      linkContent = a;
    }
    cells.push([hintCell("authorLink", linkContent)]);
    const block = WebImporter.Blocks.createBlock(document, { name: "content-hero-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-figure.js
  function parse2(element, { document }) {
    const imgs = Array.from(element.querySelectorAll(".cmp-image img, .image img, img")).filter((img, i, arr) => arr.indexOf(img) === i);
    if (imgs.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const row = imgs.map((img) => {
      const clone = document.createElement("img");
      clone.setAttribute("src", img.getAttribute("src") || "");
      clone.setAttribute("alt", img.getAttribute("alt") || "");
      return clone;
    });
    const cells = [row];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-figure", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-figure.js
  function parse3(element, { document }) {
    const cardEls = Array.from(element.querySelectorAll(".cmp-image"));
    if (cardEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardEls.forEach((cardEl) => {
      const srcImg = cardEl.querySelector("img");
      const caption = cardEl.querySelector('.cmp-image__title, [itemprop="caption"]');
      const captionText = caption ? caption.textContent.trim() : "";
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      if (srcImg) {
        const img = document.createElement("img");
        img.setAttribute("src", srcImg.getAttribute("src") || "");
        img.setAttribute("alt", srcImg.getAttribute("alt") || captionText);
        imageFrag.appendChild(img);
      }
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (captionText) {
        const p = document.createElement("p");
        p.textContent = captionText;
        textFrag.appendChild(p);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-figure", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-article.js
  function parse4(element, { document }) {
    const cardLinks = Array.from(element.querySelectorAll("a.article-card, .article-card a[href], a.article-card--mini-article")).filter((a, i, arr) => arr.indexOf(a) === i);
    if (cardLinks.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardLinks.forEach((cardLink) => {
      const href = cardLink.getAttribute("href") || "";
      const heading = cardLink.querySelector('h4, .article-title, [class*="article-title"]');
      const titleText = heading ? heading.textContent.trim() : cardLink.textContent.trim() || href;
      let img = null;
      const bgDiv = cardLink.querySelector('.imageQ, [class*="imageQ"], [style*="background-image"]');
      if (bgDiv) {
        const style = bgDiv.getAttribute("style") || "";
        const m = style.match(/url\((['"]?)(.*?)\1\)/i);
        if (m && m[2]) {
          img = document.createElement("img");
          img.setAttribute("src", m[2]);
          img.setAttribute("alt", titleText);
        }
      }
      const imageFrag = document.createDocumentFragment();
      imageFrag.appendChild(document.createComment(" field:image "));
      if (img) imageFrag.appendChild(img);
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      const h = document.createElement("h4");
      const a = document.createElement("a");
      a.setAttribute("href", href);
      a.textContent = titleText;
      h.appendChild(a);
      textFrag.appendChild(h);
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-article", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/author-bio.js
  function parse5(element, { document }) {
    const authorLinkEl = element.querySelector("a.author-header, .dv-author a[href], .author-bio-component a[href]");
    const nameEl = element.querySelector(".author-name");
    const roleEl = element.querySelector(".author-title");
    const disclosureEl = element.querySelector(".author-disclosure");
    const bioEl = element.querySelector(".bio-text");
    const moreEl = element.querySelector(".more-articles");
    const listEl = element.querySelector("ul.articles-list, .dv-links ul, ul");
    if (!nameEl && !bioEl) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const href = authorLinkEl ? authorLinkEl.getAttribute("href") || "" : "";
    const nameText = nameEl ? nameEl.textContent.trim() : "";
    const roleText = roleEl ? roleEl.textContent.trim() : "";
    const disclosureText = disclosureEl ? disclosureEl.textContent.trim() : "";
    let img = null;
    const bgDiv = element.querySelector('.author-img, [class*="author-img"], [style*="background-image"]');
    if (bgDiv) {
      const style = bgDiv.getAttribute("style") || "";
      const m = style.match(/url\((['"]?)(.*?)\1\)/i);
      if (m && m[2]) {
        img = document.createElement("img");
        img.setAttribute("src", m[2]);
        img.setAttribute("alt", nameText);
      }
    }
    const identity = document.createElement("div");
    const identityHint = document.createComment(" field:identity ");
    identity.appendChild(identityHint);
    if (img) {
      const picP = document.createElement("p");
      const a = document.createElement("a");
      a.setAttribute("href", href);
      a.appendChild(img);
      picP.appendChild(a);
      identity.appendChild(picP);
    }
    if (nameText) {
      const nm = document.createElement("p");
      const strong = document.createElement("strong");
      const a = document.createElement("a");
      a.setAttribute("href", href);
      a.textContent = nameText;
      strong.appendChild(a);
      nm.appendChild(strong);
      identity.appendChild(nm);
    }
    if (roleText) {
      const r = document.createElement("p");
      r.textContent = roleText;
      identity.appendChild(r);
    }
    if (disclosureText) {
      const d = document.createElement("p");
      d.appendChild(document.createElement("em")).textContent = disclosureText;
      identity.appendChild(d);
    }
    const bio = document.createElement("div");
    const bioHint = document.createComment(" field:bio ");
    bio.appendChild(bioHint);
    if (bioEl) {
      Array.from(bioEl.querySelectorAll("p")).forEach((p) => {
        if (p.textContent.trim()) bio.appendChild(p.cloneNode(true));
      });
    }
    if (moreEl && moreEl.textContent.trim()) {
      const h = document.createElement("h4");
      h.textContent = moreEl.textContent.trim();
      bio.appendChild(h);
    }
    if (listEl) {
      const ul = document.createElement("ul");
      Array.from(listEl.querySelectorAll("li")).forEach((li) => {
        const srcA = li.querySelector("a[href]");
        const newLi = document.createElement("li");
        if (srcA) {
          const a = document.createElement("a");
          a.setAttribute("href", srcA.getAttribute("href") || "");
          a.textContent = srcA.textContent.trim();
          newLi.appendChild(a);
        } else {
          newLi.textContent = li.textContent.trim();
        }
        ul.appendChild(newLi);
      });
      if (ul.children.length) bio.appendChild(ul);
    }
    const cells = [[identity], [bio]];
    const block = WebImporter.Blocks.createBlock(document, { name: "Author Bio", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-resource.js
  function parse6(element, { document }) {
    const cardEls = Array.from(element.querySelectorAll(".card"));
    if (cardEls.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [];
    cardEls.forEach((cardEl) => {
      const heading = cardEl.querySelector('h4, .heading, [class*="heading"]');
      const desc = cardEl.querySelector('.rich-text, [class*="rich-text"]');
      const cta = cardEl.querySelector("a.button, .card__body a[href], a[href]");
      const imageFrag = document.createDocumentFragment();
      const textFrag = document.createDocumentFragment();
      textFrag.appendChild(document.createComment(" field:text "));
      if (heading && heading.textContent.trim()) {
        const h = document.createElement("h4");
        h.textContent = heading.textContent.trim();
        textFrag.appendChild(h);
      }
      if (desc && desc.textContent.trim()) {
        const p = document.createElement("p");
        p.textContent = desc.textContent.trim();
        textFrag.appendChild(p);
      }
      if (cta) {
        const a = document.createElement("a");
        a.setAttribute("href", cta.getAttribute("href") || "");
        a.textContent = cta.textContent.trim();
        textFrag.appendChild(a);
      }
      cells.push([imageFrag, textFrag]);
    });
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-resource", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/thereadypatient-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  var CONTENT_GRID_SELECTOR = "div.root.responsivegrid > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12";
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#onetrust-banner-sdk",
        "#ot-sdk-btn-floating"
      ]);
      WebImporter.DOMUtils.remove(element, [
        ".utility-bar",
        ".breadcrumb-zb",
        ".cmp-breadcrumb",
        ".useful-rating"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      const contentGrid = element.querySelector(CONTENT_GRID_SELECTOR);
      if (contentGrid) {
        element.replaceChildren(contentGrid);
      }
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav"
      ]);
      WebImporter.DOMUtils.remove(element, [
        "svg",
        "use",
        "script",
        "noscript",
        "link",
        "style"
      ]);
    }
  }

  // tools/importer/transformers/thereadypatient-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const doc = payload && payload.document || element.ownerDocument;
      const sections = payload && payload.template && payload.template.sections;
      if (!doc || !Array.isArray(sections) || sections.length < 2) {
        return;
      }
      const resolved = sections.map((section) => {
        let el = null;
        if (section && section.selector) {
          el = element.querySelector(section.selector) || doc.querySelector(section.selector);
        }
        return { section, el };
      });
      for (let i = resolved.length - 1; i >= 0; i -= 1) {
        const { section, el } = resolved[i];
        if (!el) {
          continue;
        }
        if (section && section.style) {
          const metadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (el.parentNode) {
            el.parentNode.insertBefore(metadataBlock, el.nextSibling);
          }
        }
        if (i > 0 && el.previousElementSibling) {
          const hr = doc.createElement("hr");
          if (el.parentNode) {
            el.parentNode.insertBefore(hr, el);
          }
        }
      }
    }
  }

  // tools/importer/import-knee-article.js
  var parsers = {
    "content-hero-article": parse,
    "columns-figure": parse2,
    "cards-figure": parse3,
    "cards-article": parse4,
    "author-bio": parse5,
    "cards-resource": parse6
  };
  var PAGE_TEMPLATE = {
    name: "knee-article",
    description: "ReadyPatient knee article page: article header, article body (rich text, image figures, captioned illustration group, related-article cards, author bio), and a closing resource cards section. Site header/footer excluded.",
    urls: [
      "https://www.thereadypatient.com/knee/knee-pain-explained.html"
    ],
    blocks: [
      {
        name: "content-hero-article",
        instances: [".article-header"]
      },
      {
        name: "columns-figure",
        instances: ["div.layout_container.aem-GridColumn--default--6:has(.cmp-image):not(:has(.cmp-image__title)):not(:has(.article-card)):not(:has(.aem-GridColumn--offset--default--2))"]
      },
      {
        name: "cards-figure",
        instances: ["div.layout_container.aem-GridColumn--default--6:has(.cmp-image__title)"]
      },
      {
        name: "cards-article",
        instances: ["div.layout_container.aem-GridColumn--default--6:has(.article-card)"]
      },
      {
        name: "author-bio",
        instances: [".author-bio"]
      },
      {
        name: "cards-resource",
        instances: [".resource-grid-cards"],
        section: "highlight"
      }
    ],
    sections: [
      {
        id: "section-1-article-header",
        name: "Article Header",
        selector: ".article-header",
        style: null,
        blocks: ["content-hero-article"],
        defaultContent: []
      },
      {
        id: "section-2-article-body",
        name: "Article Body",
        selector: "body > div.root.responsivegrid > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.wrapper:nth-of-type(2)",
        style: null,
        blocks: ["columns-figure", "cards-figure", "cards-article", "author-bio"],
        defaultContent: [".text .cmp-text", ".button > a.button--center"]
      },
      {
        id: "section-3-more-you-can-do",
        name: "Here's more you can do",
        selector: "body > div.root.responsivegrid > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.aem-Grid.aem-Grid--12.aem-Grid--default--12 > div.responsivegrid.aem-GridColumn.aem-GridColumn--default--12 > div.wrapper:nth-of-type(3)",
        style: "highlight",
        blocks: ["cards-resource"],
        defaultContent: [".title .cmp-title > h3"]
      }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_knee_article_default = {
    transform: (payload) => {
      const {
        document,
        url,
        html,
        params
      } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        if (!block.element.parentNode) return;
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_knee_article_exports);
})();
