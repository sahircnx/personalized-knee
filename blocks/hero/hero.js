export default async function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Mark first slide as active
  rows[0].classList.add('active');

  // Create carousel indicators if multiple slides
  if (rows.length > 1) {
    const indicators = document.createElement('div');
    indicators.className = 'hero-indicators';

    rows.forEach((row, i) => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === 0) btn.classList.add('active');
      btn.addEventListener('click', () => {
        rows.forEach((r) => r.classList.remove('active'));
        indicators.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        row.classList.add('active');
        btn.classList.add('active');
      });
      indicators.append(btn);
    });

    block.append(indicators);

    // Auto-advance every 4.5 seconds
    let current = 0;
    setInterval(() => {
      current = (current + 1) % rows.length;
      rows.forEach((r) => r.classList.remove('active'));
      indicators.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
      rows[current].classList.add('active');
      indicators.querySelectorAll('button')[current].classList.add('active');
    }, 4500);
  }
}
