import { createOptimizedPicture } from '../../scripts/aem.js';

export default function decorate(block) {
  const rows = [...block.children];
  if (rows.length === 0) return;

  const cell = (rowIdx, colIdx = 0) => {
    const row = rows[rowIdx];
    if (!row) return null;
    return row.children[colIdx] || null;
  };

  // Parent Fields (Rows 0-5)
  const mainHeadingCell = cell(0);
  const titleCell = cell(1);
  const descCell = cell(2);
  const disclaimerCell = cell(3);
  const imageCell = cell(4);
  const captionCell = cell(5);

  // Tip Items (Rows 6+)
  const tipItems = rows.slice(6).map((row) => {
    const groupName = row.children[0]?.textContent?.trim();
    const icon = row.children[1]?.querySelector('picture, img');
    const text = row.children[2]?.textContent?.trim();
    return { groupName, icon, text };
  });

  // Group tips by groupName
  const groups = {};
  tipItems.forEach((item) => {
    if (!item.groupName) return;
    if (!groups[item.groupName]) groups[item.groupName] = [];
    groups[item.groupName].push(item);
  });

  // ── Build DOM ──────────────────────────────────────────────────────────────
  const blockInner = document.createElement('div');
  blockInner.className = 'lt-inner';

  // ── Main Heading (Top) ─────────────────────────────────────────────────────
  if (mainHeadingCell?.textContent?.trim()) {
    const heading = document.createElement('h2');
    heading.className = 'lt-main-heading';
    heading.textContent = mainHeadingCell.textContent.trim();
    block.prepend(heading);
  }

  // ── Layout Container ───────────────────────────────────────────────────────
  const container = document.createElement('div');
  container.className = 'lt-container';

  // ── Left Column ────────────────────────────────────────────────────────────
  const leftCol = document.createElement('div');
  leftCol.className = 'lt-left-col';

  if (titleCell?.textContent?.trim()) {
    const title = document.createElement('h3');
    title.className = 'lt-title';
    title.textContent = titleCell.textContent.trim();
    leftCol.append(title);
  }

  if (descCell?.innerHTML?.trim()) {
    const desc = document.createElement('div');
    desc.className = 'lt-description';
    desc.innerHTML = descCell.innerHTML;
    leftCol.append(desc);
  }

  if (disclaimerCell?.textContent?.trim()) {
    const disclaimer = document.createElement('p');
    disclaimer.className = 'lt-disclaimer';
    disclaimer.textContent = disclaimerCell.textContent.trim();
    leftCol.append(disclaimer);
  }

  // Tips Box
  if (Object.keys(groups).length > 0) {
    const tipsBox = document.createElement('div');
    tipsBox.className = 'lt-tips-box';

    Object.entries(groups).forEach(([groupName, items]) => {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'lt-tip-group';

      const groupTitle = document.createElement('h4');
      groupTitle.className = 'lt-group-title';
      groupTitle.textContent = groupName;
      groupDiv.append(groupTitle);

      const tipList = document.createElement('ul');
      tipList.className = 'lt-tip-list';

      items.forEach((item) => {
        const li = document.createElement('li');
        li.className = 'lt-tip-item';

        if (item.icon) {
          const iconSpan = document.createElement('span');
          iconSpan.className = 'lt-tip-icon';
          iconSpan.append(item.icon);
          li.append(iconSpan);
        }

        const textSpan = document.createElement('span');
        textSpan.className = 'lt-tip-text';
        textSpan.textContent = item.text;
        li.append(textSpan);

        tipList.append(li);
      });

      groupDiv.append(tipList);
      tipsBox.append(groupDiv);
    });

    leftCol.append(tipsBox);
  }

  // ── Right Column ───────────────────────────────────────────────────────────
  const rightCol = document.createElement('div');
  rightCol.className = 'lt-right-col';

  const picture = imageCell?.querySelector('picture');
  if (picture) {
    const img = picture.querySelector('img');
    if (img) {
      const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
      rightCol.append(optimizedPic);
    } else {
      rightCol.append(picture);
    }
  }

  if (captionCell?.textContent?.trim()) {
    const caption = document.createElement('span');
    caption.className = 'lt-caption';
    caption.textContent = captionCell.textContent.trim();
    rightCol.append(caption);
  }

  // ── Assemble ───────────────────────────────────────────────────────────────
  container.append(leftCol);
  container.append(rightCol);
  block.append(container);

  // Clear original rows except what we prepended
  rows.forEach((row) => row.remove());
}
