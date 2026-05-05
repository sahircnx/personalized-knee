export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  // Extract cells from Universal Editor rows
  const getCell = (idx) => {
    if (!rows[idx]) return null;
    if (rows[idx].children.length === 1 && rows[idx].firstElementChild.tagName === 'DIV') {
      return rows[idx].children[0];
    }
    return rows[idx];
  };

  // UE field order: heading, varusTitle, varusDescription, image, imageCaption, valgusTitle, valgusDescription, summary
  const headingCell = getCell(0);
  const varusTitleCell = getCell(1);
  const varusDescCell = getCell(2);
  const imageCell = getCell(3);
  const imageCaptionCell = getCell(4);
  const valgusTitleCell = getCell(5);
  const valgusDescCell = getCell(6);
  const summaryCell = getCell(7);

  // Clear block
  block.textContent = '';

  // Create outer wrapper
  const wrapper = document.createElement('div');
  wrapper.className = 'varus-and-valgus-wrapper';

  // Heading
  if (headingCell && headingCell.textContent.trim()) {
    const heading = document.createElement('h1');
    heading.className = 'varus-and-valgus-heading';
    heading.textContent = headingCell.textContent.trim();
    wrapper.append(heading);
  }

  // Center content area (texts + image)
  const centerArea = document.createElement('div');
  centerArea.className = 'varus-and-valgus-center';

  // Left text (Varus)
  const leftText = document.createElement('div');
  leftText.className = 'varus-and-valgus-left-text';
  if (varusTitleCell && varusTitleCell.textContent.trim()) {
    const title = document.createElement('h5');
    title.className = 'varus-and-valgus-label-title';
    title.textContent = varusTitleCell.textContent.trim();
    leftText.append(title);
  }
  if (varusDescCell && varusDescCell.textContent.trim()) {
    const desc = document.createElement('p');
    desc.className = 'varus-and-valgus-label-desc';
    desc.innerHTML = varusDescCell.innerHTML;
    leftText.append(desc);
  }
  centerArea.append(leftText);

  // Image container (circular with brackets)
  const imageContainer = document.createElement('div');
  imageContainer.className = 'varus-and-valgus-image-container';

  if (imageCell) {
    const picture = imageCell.querySelector('picture');
    if (picture) {
      imageContainer.append(picture);
    } else {
      const img = imageCell.querySelector('img');
      if (img) imageContainer.append(img);
    }
  }

  // Image caption
  if (imageCaptionCell && imageCaptionCell.textContent.trim()) {
    const caption = document.createElement('p');
    caption.className = 'varus-and-valgus-caption';
    caption.textContent = imageCaptionCell.textContent.trim();
    imageContainer.append(caption);
  }

  centerArea.append(imageContainer);

  // Right text (Valgus)
  const rightText = document.createElement('div');
  rightText.className = 'varus-and-valgus-right-text';
  if (valgusTitleCell && valgusTitleCell.textContent.trim()) {
    const title = document.createElement('h5');
    title.className = 'varus-and-valgus-label-title';
    title.textContent = valgusTitleCell.textContent.trim();
    rightText.append(title);
  }
  if (valgusDescCell && valgusDescCell.textContent.trim()) {
    const desc = document.createElement('p');
    desc.className = 'varus-and-valgus-label-desc';
    desc.innerHTML = valgusDescCell.innerHTML;
    rightText.append(desc);
  }
  centerArea.append(rightText);

  wrapper.append(centerArea);

  // Summary / bottom text
  if (summaryCell && summaryCell.textContent.trim()) {
    const summary = document.createElement('p');
    summary.className = 'varus-and-valgus-summary';
    summary.innerHTML = summaryCell.innerHTML;
    wrapper.append(summary);
  }

  block.append(wrapper);
}
