import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

const SOCIAL_ICONS = {
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>',
  linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>',
  youtube: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>',
  reddit: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 01-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 01.042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 014.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 01.14-.197.35.35 0 01.238-.042l2.906.617a1.214 1.214 0 011.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 00-.231.094.33.33 0 000 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 00.029-.463.33.33 0 00-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 00-.232-.095z"/></svg>',
};

function getSocialKey(text) {
  const t = text.toLowerCase();
  if (t.includes('facebook')) return 'facebook';
  if (t.includes('instagram')) return 'instagram';
  if (t === 'x' || t.includes('x.com') || t.includes('twitter')) return 'x';
  if (t.includes('linkedin')) return 'linkedin';
  if (t.includes('youtube')) return 'youtube';
  if (t.includes('reddit')) return 'reddit';
  return null;
}

/**
 * Footer content model (4 sections in footer.plain.html):
 *   [0] h4 + p ("This, you can do.") + h5      → header + marquee
 *   [1] ul(s) + p (social links)                → legal links + social icons (left col)
 *   [2] long disclaimers (may end with ©2025)   → disclaimer text (right col)
 *   [3] picture×2 + "© 2025 … All Rights"      → logos + copyright
 *
 * Detection: use index-based assignment — the content model is fixed.
 */
function buildFromSections(sections) {
  const wrapper = document.createElement('div');
  wrapper.className = 'footer-inner';

  // ── Section 0: header ──────────────────────────────────
  const s0 = sections[0];
  if (s0) {
    const header = document.createElement('div');
    header.className = 'footer-header';

    const h4 = s0.querySelector('h4');
    if (h4) header.append(h4.cloneNode(true));

    const marqueePara = [...s0.querySelectorAll('p')].find(
      (p) => p.textContent.trim().toLowerCase().startsWith('this,'),
    );
    if (marqueePara) {
      const text = marqueePara.textContent.trim();
      const marqueeWrap = document.createElement('div');
      marqueeWrap.className = 'footer-marquee';
      const track = document.createElement('div');
      track.className = 'footer-marquee-track';
      for (let r = 0; r < 8; r += 1) {
        const span = document.createElement('span');
        span.className = 'footer-marquee-item';
        span.textContent = `\u00a0${text}\u00a0`;
        track.append(span);
      }
      marqueeWrap.append(track);
      header.append(marqueeWrap);
    }

    const h5 = s0.querySelector('h5');
    if (h5) header.append(h5.cloneNode(true));

    wrapper.append(header);
  }

  // ── Sections 1+2: two-column copy row ─────────────────
  const copyRow = document.createElement('div');
  copyRow.className = 'footer-copy-row';

  // Left col: legal links + social icons (section 1)
  const s1 = sections[1];
  if (s1) {
    const legalCol = document.createElement('div');
    legalCol.className = 'footer-legal-col';

    s1.querySelectorAll('ul').forEach((ul) => {
      const clone = ul.cloneNode(true);
      clone.querySelectorAll('a').forEach((a) => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      });
      legalCol.append(clone);
    });

    const socialP = [...s1.querySelectorAll('p')].find(
      (p) => p.querySelectorAll('a').length >= 3,
    );
    if (socialP) {
      const socialRow = document.createElement('div');
      socialRow.className = 'footer-social';
      socialP.querySelectorAll('a').forEach((a) => {
        const key = getSocialKey(a.textContent);
        if (!key) return;
        const link = document.createElement('a');
        link.href = a.href;
        link.className = 'footer-social-link';
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.setAttribute('aria-label', a.textContent.trim());
        link.innerHTML = `<span class="footer-social-icon">${SOCIAL_ICONS[key]}</span>`;
        socialRow.append(link);
      });
      legalCol.append(socialRow);
    }

    copyRow.append(legalCol);
  }

  // Right col: disclaimer (section 2) — has long text; may end with "©2025 Zimmer Biomet"
  const s2 = sections[2];
  if (s2) {
    const disclaimerCol = document.createElement('div');
    disclaimerCol.className = 'footer-disclaimer-col';
    s2.querySelectorAll('p').forEach((p) => {
      const clone = p.cloneNode(true);
      clone.querySelectorAll('a').forEach((a) => {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      });
      disclaimerCol.append(clone);
    });
    copyRow.append(disclaimerCol);
  }

  if (copyRow.children.length) wrapper.append(copyRow);

  // ── Section 3: logos + copyright ──────────────────────
  const s3 = sections[3];
  if (s3) {
    const bottom = document.createElement('div');
    bottom.className = 'footer-bottom';

    const pictures = [...s3.querySelectorAll('picture')];
    const allImgSrcs = pictures.map((pic) => pic.querySelector('img')?.src ?? '');
    const allSame = allImgSrcs.length > 1 && allImgSrcs.every((s) => s === allImgSrcs[0]);

    // PKN logo — full width row
    const pknRow = document.createElement('div');
    pknRow.className = 'footer-logo-pkn';
    if (pictures[0] && !allSame) {
      pknRow.append(pictures[0].cloneNode(true));
    } else {
      const img = document.createElement('img');
      img.src = '/drafts/images/footer-logo.png';
      img.alt = 'The Personalized Knee\u00ae';
      img.loading = 'lazy';
      pknRow.append(img);
    }
    bottom.append(pknRow);

    // ZB logo + copyright row
    const bottomRow = document.createElement('div');
    bottomRow.className = 'footer-bottom-row';

    const zbWrap = document.createElement('div');
    zbWrap.className = 'footer-logo-zb';
    if (pictures[1] && !allSame) {
      zbWrap.append(pictures[1].cloneNode(true));
    } else {
      const img = document.createElement('img');
      img.src = '/drafts/images/zimmer-biomet-logo.svg';
      img.alt = 'Zimmer Biomet';
      img.loading = 'lazy';
      zbWrap.append(img);
    }
    bottomRow.append(zbWrap);

    const copyrightP = [...s3.querySelectorAll('p')].find(
      (p) => p.textContent.includes('\u00a9') || p.textContent.includes('Rights Reserved'),
    );
    if (copyrightP) {
      const cp = copyrightP.cloneNode(true);
      cp.className = 'footer-copyright';
      bottomRow.append(cp);
    }

    bottom.append(bottomRow);
    wrapper.append(bottom);
  }

  return wrapper;
}

export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/footer';
  const fragment = await loadFragment(footerPath);

  block.textContent = '';
  const sections = [...fragment.querySelectorAll('.section')];
  block.append(buildFromSections(sections));
}
