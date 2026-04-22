import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta
    ? new URL(footerMeta, window.location).pathname
    : '/content/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // Identify sections by content
  const sections = footer.querySelectorAll('.section');
  let linksSection = null;
  let disclaimerSection = null;

  sections.forEach((section) => {
    const h4 = section.querySelector('h4');
    const h5 = section.querySelector('h5');
    const ul = section.querySelector('ul');
    const pictures = section.querySelectorAll('picture');

    if (h4 && h5 && !ul && pictures.length === 0) {
      section.classList.add('footer-hero');
    } else if (ul) {
      section.classList.add('footer-links');
      linksSection = section;
    } else if (pictures.length > 0) {
      section.classList.add('footer-logos');
    } else {
      section.classList.add('footer-disclaimer');
      disclaimerSection = section;
    }
  });

  // Wrap links and disclaimer in a shared container for side-by-side desktop layout
  if (linksSection && disclaimerSection) {
    const middleWrapper = document.createElement('div');
    middleWrapper.classList.add('footer-middle');
    linksSection.parentNode.insertBefore(middleWrapper, linksSection);
    middleWrapper.append(linksSection);
    middleWrapper.append(disclaimerSection);
  }

  block.append(footer);
}
