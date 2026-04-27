/**
 * Knee Stories Block
 *
 * Content model:
 *   row[0] — label text ("The Personalized Knee Stories")
 *   row[1] — h1 heading ("People like you who have already made the leap")
 *   row[2] — empty spacer
 *   row[3] — CTA link text ("Watch the stories")
 *   row[4+] — cards: cell[0]=image (alt="Role, Age years old"), cell[1]=age number
 */

const CARD_GAP = 22; // px — matches production
const SPEED = 0.5; // px per animation frame

export default function decorate(block) {
  const rows = [...block.children];

  /* ── Parse header rows (0–3) ────────────────────────── */
  const labelText = rows[0]?.textContent?.trim() ?? '';
  const headingText = rows[1]?.textContent?.trim() ?? '';
  // row[2] empty spacer — skip
  const ctaText = rows[3]?.textContent?.trim() ?? '';

  /* ── Parse card rows (4+) ───────────────────────────── */
  const cardRows = rows.slice(4).filter((row) => row.querySelector('img'));

  function buildCard(row) {
    const cells = [...row.children];
    const imgCell = cells[0];
    const img = imgCell?.querySelector('img');

    const card = document.createElement('div');
    card.className = 'ks-card';

    // Background image
    if (img) {
      const picture = imgCell.querySelector('picture');
      if (picture) {
        card.appendChild(picture);
      } else {
        card.style.backgroundImage = `url('${img.src}')`;
      }
    }

    // Text overlay: parse role + age from img alt ("Retail Manager and Caregiver, 62 years old")
    const alt = img?.alt ?? '';
    const altParts = alt.split(',');
    const role = altParts[0]?.trim() ?? '';
    const agePart = altParts.slice(1).join(',').trim(); // "62 years old"

    const textDiv = document.createElement('div');
    textDiv.className = 'ks-card-text';

    if (role) {
      const h5 = document.createElement('h5');
      h5.textContent = role;
      textDiv.appendChild(h5);
    }
    if (agePart) {
      const p = document.createElement('p');
      p.textContent = agePart;
      textDiv.appendChild(p);
    }

    card.appendChild(textDiv);
    return card;
  }

  const cards = cardRows.map((row) => buildCard(row));

  /* ── Build header ───────────────────────────────────── */
  const header = document.createElement('div');
  header.className = 'ks-header';

  if (labelText) {
    const h5 = document.createElement('h5');
    h5.textContent = labelText;
    header.appendChild(h5);
  }

  if (headingText) {
    const h1 = document.createElement('h1');
    h1.textContent = headingText;
    header.appendChild(h1);
  }

  if (ctaText) {
    const p = document.createElement('p');
    p.className = 'button-container';
    const a = document.createElement('a');
    a.href = '/en/patient-stories/zimmer-reviews.html';
    a.className = 'button';
    a.textContent = ctaText;
    p.appendChild(a);
    header.appendChild(p);
  }

  /* ── Build marquee track ────────────────────────────── */
  const trackWrapper = document.createElement('div');
  trackWrapper.className = 'ks-track-wrapper';

  const track = document.createElement('div');
  track.className = 'ks-track';

  // Three copies for seamless infinite scroll
  for (let i = 0; i < 3; i += 1) {
    cards.forEach((card) => track.appendChild(card.cloneNode(true)));
  }

  trackWrapper.appendChild(track);

  /* ── Assemble ────────────────────────────────────────── */
  block.textContent = '';
  block.appendChild(header);
  block.appendChild(trackWrapper);

  /* ── JS-driven smooth marquee ───────────────────────── */
  // Wait for layout to settle before reading widths
  requestAnimationFrame(() => {
    const cardEls = track.querySelectorAll('.ks-card');
    if (!cardEls.length) return;

    // One "set" width = N cards × (card width + gap)
    const cardW = cardEls[0].offsetWidth;
    const totalCards = cards.length;
    const setWidth = totalCards * (cardW + CARD_GAP);

    let x = 0;
    let paused = false;
    let rafId;

    function step() {
      if (!paused) {
        x -= SPEED;
        if (Math.abs(x) >= setWidth) x += setWidth; // seamless reset
        track.style.transform = `translateX(${x}px)`;
      }
      rafId = requestAnimationFrame(step);
    }

    rafId = requestAnimationFrame(step);

    trackWrapper.addEventListener('mouseenter', () => { paused = true; });
    trackWrapper.addEventListener('mouseleave', () => { paused = false; });

    // Pause when not visible (IntersectionObserver)
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) {
            cancelAnimationFrame(rafId);
          } else {
            rafId = requestAnimationFrame(step);
          }
        });
      });
      io.observe(block);
    }
  });
}
