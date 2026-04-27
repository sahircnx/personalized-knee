/**
 * Hero Banner Carousel block.
 *
 * Supported document structures:
 *
 * A) Two-column rows — each row is a complete slide:
 *      | background picture | text content (h4, p, h5, buttons, footnote) |
 *
 * B) Single-column row pairs — paired rows form one slide:
 *      Row A: | background picture |
 *      Row B: | text content       |
 *
 * The block auto-detects the structure by checking if the first row has two columns.
 */

const SLIDE_INTERVAL = 4500;

function buildSlide(imageCell, contentCell, index) {
  const slide = document.createElement('div');
  slide.classList.add('hero-banner-carousel-slide');
  slide.setAttribute('role', 'tabpanel');
  slide.setAttribute('aria-label', `Slide ${index + 1}`);
  slide.id = `hero-banner-carousel-slide-${index}`;
  if (index !== 0) slide.setAttribute('aria-hidden', 'true');

  // Background image
  const picture = imageCell?.querySelector('picture');
  if (picture) {
    const bgWrapper = document.createElement('div');
    bgWrapper.classList.add('hero-banner-carousel-bg');
    bgWrapper.append(picture);
    slide.append(bgWrapper);
  }

  // Content overlay
  const content = document.createElement('div');
  content.classList.add('hero-banner-carousel-content');

  const sourceEl = contentCell?.querySelector('div') ?? contentCell;
  if (sourceEl) {
    const textGroup = document.createElement('div');
    textGroup.classList.add('hero-banner-carousel-text');

    const ctaGroup = document.createElement('div');
    ctaGroup.classList.add('hero-banner-carousel-cta');

    const attribution = document.createElement('div');
    attribution.classList.add('hero-banner-carousel-attribution');

    const children = [...sourceEl.children];
    let ctaStarted = false;

    children.forEach((child) => {
      const links = child.querySelectorAll('a');
      const isCtaP = child.tagName === 'P' && links.length > 0
        && child.textContent.trim() === links[0].textContent.trim();
      const isEm = child.querySelector('em') && child.tagName === 'P';

      if (isCtaP) {
        ctaStarted = true;
        const link = links[0];
        link.classList.add('button');
        if (ctaGroup.children.length > 0) link.classList.add('secondary');
        ctaGroup.append(child);
      } else if (ctaStarted || isEm) {
        attribution.append(child);
      } else {
        textGroup.append(child);
      }
    });

    content.append(textGroup);
    if (ctaGroup.children.length) content.append(ctaGroup);
    if (attribution.children.length) content.append(attribution);
  }

  slide.append(content);
  return slide;
}

function goToSlide(block, index) {
  const slides = block.querySelectorAll('.hero-banner-carousel-slide');
  const dots = block.querySelectorAll('.hero-banner-carousel-dot');

  slides.forEach((slide, i) => {
    if (i === index) {
      slide.classList.add('active');
      slide.removeAttribute('aria-hidden');
    } else {
      slide.classList.remove('active');
      slide.setAttribute('aria-hidden', 'true');
    }
  });

  dots.forEach((dot, i) => {
    if (i === index) {
      dot.classList.add('active');
      dot.setAttribute('aria-selected', 'true');
      dot.setAttribute('tabindex', '0');
    } else {
      dot.classList.remove('active');
      dot.setAttribute('aria-selected', 'false');
      dot.setAttribute('tabindex', '-1');
    }
  });

  block.dataset.activeSlide = index;
}

function buildDots(count, block) {
  const nav = document.createElement('div');
  nav.classList.add('hero-banner-carousel-dots');
  nav.setAttribute('role', 'tablist');
  nav.setAttribute('aria-label', 'Choose a slide to display');

  for (let i = 0; i < count; i += 1) {
    const dot = document.createElement('button');
    dot.classList.add('hero-banner-carousel-dot');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.setAttribute('aria-controls', `hero-banner-carousel-slide-${i}`);
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.setAttribute('tabindex', i === 0 ? '0' : '-1');
    if (i === 0) dot.classList.add('active');

    dot.addEventListener('click', () => {
      goToSlide(block, i);
    });

    nav.append(dot);
  }

  // Keyboard navigation on tablist
  nav.addEventListener('keydown', (e) => {
    const allDots = [...nav.querySelectorAll('.hero-banner-carousel-dot')];
    const current = allDots.findIndex((d) => d.classList.contains('active'));
    let next = current;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      next = (current + 1) % allDots.length;
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      next = (current - 1 + allDots.length) % allDots.length;
      e.preventDefault();
    }

    if (next !== current) {
      goToSlide(block, next);
      allDots[next].focus();
    }
  });

  return nav;
}

function startAutoplay(block) {
  const slides = block.querySelectorAll('.hero-banner-carousel-slide');
  if (slides.length <= 1) return null;

  return setInterval(() => {
    const current = parseInt(block.dataset.activeSlide || '0', 10);
    const next = (current + 1) % slides.length;
    goToSlide(block, next);
  }, SLIDE_INTERVAL);
}

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const slidesWrapper = document.createElement('div');
  slidesWrapper.classList.add('hero-banner-carousel-slides');

  // Detect structure: 2-column rows vs single-column row pairs
  const firstRowCols = rows[0].children.length;
  const isTwoColumn = firstRowCols >= 2;

  let slideCount = 0;

  if (isTwoColumn) {
    // Each row = one slide [imageCol | contentCol]
    rows.forEach((row, i) => {
      const [imageCol, contentCol] = [...row.children];
      const slide = buildSlide(imageCol, contentCol, i);
      if (i === 0) slide.classList.add('active');
      slidesWrapper.append(slide);
      slideCount += 1;
    });
  } else {
    // Paired rows: row[0]+row[1] = slide 1, row[2]+row[3] = slide 2, etc.
    for (let i = 0; i < rows.length; i += 2) {
      const imageRow = rows[i];
      const contentRow = rows[i + 1];
      const imageCell = imageRow?.querySelector('div');
      const contentCell = contentRow?.querySelector('div');
      const slide = buildSlide(imageCell, contentCell, slideCount);
      if (slideCount === 0) slide.classList.add('active');
      slidesWrapper.append(slide);
      slideCount += 1;
    }
  }

  const dots = buildDots(slideCount, block);

  block.textContent = '';
  block.append(slidesWrapper);
  if (slideCount > 1) block.append(dots);
  block.dataset.activeSlide = '0';

  // Autoplay with pause on hover/focus
  let interval = startAutoplay(block);

  const pauseAutoplay = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  const resumeAutoplay = () => {
    if (!interval) {
      interval = startAutoplay(block);
    }
  };

  block.addEventListener('mouseenter', pauseAutoplay);
  block.addEventListener('mouseleave', resumeAutoplay);
  block.addEventListener('focusin', pauseAutoplay);
  block.addEventListener('focusout', resumeAutoplay);
}
