const SLIDE_INTERVAL = 4500;

/**
 * Hero Banner Carousel block.
 *
 * Authoring: each slide is its own Hero block in the document.
 * Each block has two rows:
 *   Row A — background picture
 *   Row B — text content (h4, large p, h5, buttons, footnote)
 *
 * At decoration time the first Hero block in a section absorbs all subsequent
 * Hero blocks in the same section as additional slides, then hides them.
 */

function buildSlideFromBlock(block) {
  const rows = [...block.children];
  const imageRow = rows[0];
  const textRow = rows[1];

  const slide = document.createElement('div');
  slide.className = 'hero-slide';

  // Background image
  const bgDiv = document.createElement('div');
  bgDiv.className = 'hero-bg';
  const picture = imageRow?.querySelector('picture');
  if (picture) bgDiv.append(picture);
  slide.append(bgDiv);

  // Content overlay
  const contentDiv = document.createElement('div');
  contentDiv.className = 'hero-content';

  if (textRow) {
    const children = [...(textRow.querySelector('div')?.children ?? [])];

    const textGroup = document.createElement('div');
    textGroup.className = 'hero-text';

    const ctaGroup = document.createElement('div');
    ctaGroup.className = 'hero-cta';

    const attribution = document.createElement('div');
    attribution.className = 'hero-attribution';

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

    contentDiv.append(textGroup);
    if (ctaGroup.children.length) contentDiv.append(ctaGroup);
    if (attribution.children.length) contentDiv.append(attribution);
  }

  slide.append(contentDiv);
  return slide;
}

export default function decorate(block) {
  // If this block was already absorbed by a sibling, skip it.
  if (block.dataset.heroAbsorbed) return;

  // Collect this block + any subsequent hero blocks in the same section.
  const section = block.closest('.section');
  const allHeroBlocks = section
    ? [...section.querySelectorAll('.hero.block:not([data-hero-absorbed])')]
    : [block];

  // Only the first block orchestrates the carousel.
  if (allHeroBlocks[0] !== block) return;

  // Mark siblings so their decorate() calls are no-ops.
  allHeroBlocks.slice(1).forEach((b) => {
    b.dataset.heroAbsorbed = 'true';
  });

  // Build slides from each hero block.
  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'hero-slides';

  allHeroBlocks.forEach((heroBlock, idx) => {
    const slide = buildSlideFromBlock(heroBlock);
    if (idx === 0) slide.classList.add('active');
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-label', `Slide ${idx + 1}`);
    slide.id = `hero-slide-${idx}`;
    if (idx !== 0) slide.setAttribute('aria-hidden', 'true');
    slidesWrapper.append(slide);
  });

  const slideCount = allHeroBlocks.length;

  // Build vertical indicators (right-side pill style).
  const indicatorsWrapper = document.createElement('div');
  indicatorsWrapper.className = 'hero-indicators';
  indicatorsWrapper.setAttribute('role', 'tablist');
  indicatorsWrapper.setAttribute('aria-label', 'Choose a slide to display');

  for (let i = 0; i < slideCount; i += 1) {
    const btn = document.createElement('button');
    btn.className = 'hero-indicator';
    btn.setAttribute('aria-label', `Slide ${i + 1}`);
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-controls', `hero-slide-${i}`);
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.setAttribute('tabindex', i === 0 ? '0' : '-1');
    if (i === 0) btn.classList.add('active');
    indicatorsWrapper.append(btn);
  }

  // Replace block content with assembled carousel.
  block.textContent = '';
  block.append(slidesWrapper);
  if (slideCount > 1) block.append(indicatorsWrapper);
  block.dataset.activeSlide = '0';

  // Hide absorbed sibling blocks (they are now empty shells).
  allHeroBlocks.slice(1).forEach((b) => {
    const wrapper = b.closest('.hero-wrapper');
    if (wrapper) wrapper.style.display = 'none';
    else b.style.display = 'none';
  });

  function goToSlide(index) {
    const slideEls = block.querySelectorAll('.hero-slide');
    const dotEls = block.querySelectorAll('.hero-indicator');

    slideEls.forEach((s, i) => {
      s.classList.toggle('active', i === index);
      if (i === index) {
        s.removeAttribute('aria-hidden');
      } else {
        s.setAttribute('aria-hidden', 'true');
      }
    });

    dotEls.forEach((d, i) => {
      d.classList.toggle('active', i === index);
      d.setAttribute('aria-selected', i === index ? 'true' : 'false');
      d.setAttribute('tabindex', i === index ? '0' : '-1');
    });

    block.dataset.activeSlide = index;
  }

  // Wire indicator clicks.
  block.querySelectorAll('.hero-indicator').forEach((btn, idx) => {
    btn.addEventListener('click', () => goToSlide(idx));
  });

  // Keyboard navigation on indicators.
  indicatorsWrapper.addEventListener('keydown', (e) => {
    const btns = [...indicatorsWrapper.querySelectorAll('.hero-indicator')];
    const current = btns.findIndex((b) => b.classList.contains('active'));
    let next = current;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      next = (current + 1) % btns.length;
      e.preventDefault();
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      next = (current - 1 + btns.length) % btns.length;
      e.preventDefault();
    }
    if (next !== current) {
      goToSlide(next);
      btns[next].focus();
    }
  });

  // Autoplay (only when multiple slides exist).
  if (slideCount > 1) {
    let interval = setInterval(() => {
      const current = parseInt(block.dataset.activeSlide || '0', 10);
      goToSlide((current + 1) % slideCount);
    }, SLIDE_INTERVAL);

    const pause = () => { clearInterval(interval); interval = null; };
    const resume = () => {
      if (!interval) {
        interval = setInterval(() => {
          const current = parseInt(block.dataset.activeSlide || '0', 10);
          goToSlide((current + 1) % slideCount);
        }, SLIDE_INTERVAL);
      }
    };

    block.addEventListener('mouseenter', pause);
    block.addEventListener('mouseleave', resume);
    block.addEventListener('focusin', pause);
    block.addEventListener('focusout', resume);
  }
}
