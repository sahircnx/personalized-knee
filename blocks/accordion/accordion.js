/**
 * Accordion Block
 *
 * Authored as a table:
 *   Row 1, Col 1: accordion item title (heading or text)
 *   Row 1, Col 2: accordion item body (any content)
 *   Row 2, Col 1: title
 *   Row 2, Col 2: body
 *   … one row per item
 */

function buildAccordionItem(title, body) {
  const item = document.createElement('div');
  item.classList.add('accordion-item');

  const header = document.createElement('button');
  header.classList.add('accordion-header');
  header.setAttribute('type', 'button');
  header.setAttribute('aria-expanded', 'false');

  const titleSpan = document.createElement('span');
  titleSpan.classList.add('accordion-title');
  titleSpan.innerHTML = title;

  const iconSpan = document.createElement('span');
  iconSpan.classList.add('accordion-icon');
  iconSpan.setAttribute('aria-hidden', 'true');

  header.append(titleSpan, iconSpan);

  const panel = document.createElement('div');
  panel.classList.add('accordion-panel');
  panel.setAttribute('hidden', '');
  panel.innerHTML = body;

  header.addEventListener('click', () => {
    const expanded = header.getAttribute('aria-expanded') === 'true';
    // Collapse all sibling items
    item.closest('.accordion').querySelectorAll('.accordion-item').forEach((sibling) => {
      sibling.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      sibling.querySelector('.accordion-panel').setAttribute('hidden', '');
      sibling.classList.remove('accordion-item--expanded');
    });
    // Toggle this one
    if (!expanded) {
      header.setAttribute('aria-expanded', 'true');
      panel.removeAttribute('hidden');
      item.classList.add('accordion-item--expanded');
    }
  });

  item.append(header, panel);
  return item;
}

export default function decorate(block) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('accordion-wrapper');

  const rows = [...block.querySelectorAll(':scope > div')];
  rows.forEach((row) => {
    const cells = [...row.querySelectorAll(':scope > div')];
    if (cells.length < 2) return;
    const titleHtml = cells[0].innerHTML.trim();
    const bodyHtml = cells[1].innerHTML.trim();
    wrapper.append(buildAccordionItem(titleHtml, bodyHtml));
  });

  block.textContent = '';
  block.append(wrapper);
}
