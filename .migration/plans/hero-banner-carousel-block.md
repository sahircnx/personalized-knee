# Hero Banner Carousel Block Development Plan

## Overview
Develop a **hero-banner-carousel** block for AEM Edge Delivery Services that replicates the hero carousel experience from [thepersonalizedknee.com/en](https://www.thepersonalizedknee.com/en). The carousel features full-width background images, overlay text content, CTA buttons, navigation dots, and auto-rotation across 4 slides.

## Reference Site Analysis

**Carousel Behavior:**
- 4 slides with auto-rotation
- Each slide has: full-width background image, heading (h4), large subtitle text, sub-heading (h5), two CTA buttons, and a small attribution text
- Navigation dots at bottom-right (desktop) / bottom-center (mobile)
- Smooth fade/slide transitions between slides

**Desktop Layout (≥900px):**
- Full viewport width, large height (~700px+)
- Padding: `325px 108px 240px` (content positioned center-left)
- h4: 32px, medium weight, white
- Subtitle (p): 152px, enormous display text, white
- h5: 24px, regular weight, white
- CTA buttons: pill-shaped (border-radius: 10000px), white border, 18px font
- Dots: 7px circles, positioned bottom-right

**Mobile Layout (<900px):**
- Reduced padding: `180px 24px 58px`
- h4: 24px
- Subtitle: 72px
- h5: 18px
- Buttons: 16px, stacked
- Dots: centered at bottom

## Checklist

### Block Implementation
- [ ] **1. Create block folder structure** — Create `blocks/hero-banner-carousel/` with `hero-banner-carousel.js` and `hero-banner-carousel.css`
- [ ] **2. Implement hero-banner-carousel.js** — JavaScript decoration logic:
  - Parse rows from the EDS block table (each row = one slide)
  - Row structure: Col1 = background image, Col2 = rich text content (heading, subtitle, sub-heading, CTA links, attribution)
  - Build carousel wrapper with slides, each having background image and text overlay
  - Add navigation dots (tablist/tab pattern with ARIA accessibility)
  - Implement auto-rotation (every ~6 seconds) with pause on hover/focus
  - Implement dot click navigation
  - Add smooth CSS transitions between slides (fade)
  - Handle keyboard navigation (arrow keys)
- [ ] **3. Implement hero-banner-carousel.css** — Full responsive styling:
  - Full-width container (override `.section > div` max-width)
  - Background images with `cover` sizing
  - White text overlays with proper typography hierarchy
  - Pill-shaped CTA buttons with white border (primary) and outline (secondary)
  - Navigation dots styling (active vs inactive)
  - Desktop styles: large typography (152px subtitle), generous padding
  - Mobile styles: scaled-down typography (72px subtitle), tighter padding
  - Smooth fade transitions
  - Dark overlay gradient for text readability

### EDS Authoring Configuration
- [ ] **4. Create block model JSON** — Create `blocks/hero-banner-carousel/_hero-banner-carousel.json` with:
  - Definition: block name "Hero Banner Carousel", id "hero-banner-carousel"
  - Model: fields for each slide item (background image, image alt, rich text content)
  - Use block/item pattern for repeatable slides (like Cards block)
- [ ] **5. Update component-models.json** — Add `hero-banner-carousel` and `hero-banner-carousel-item` model definitions
- [ ] **6. Update component-definition.json** — Add "Hero Banner Carousel" and "Hero Banner Carousel Item" to the Blocks group
- [ ] **7. Update component-filters.json** — Add `hero-banner-carousel` filter allowing `hero-banner-carousel-item` children, and add `hero-banner-carousel` to the `section` filter

### Verification
- [ ] **8. Preview and verify** — Check the block renders correctly at the local preview with proper carousel behavior, responsive layout, and accessibility

## Content Model Design

Each slide in the carousel is authored as a row in the block table:

| Hero Banner Carousel |  |
|---|---|
| `<picture>` (background image) | `<h4>Heading</h4><p>Large Subtitle</p><h5>Sub-heading</h5><p><a href="...">CTA 1</a></p><p><a href="...">CTA 2</a></p><p><em>Attribution</em></p>` |
| `<picture>` (slide 2 bg) | `<h4>...</h4><p>...</p>...` |
| ... | ... |

## Key Design Decisions
- **Block name**: `hero-banner-carousel` (follows EDS naming convention with hyphens)
- **Slide pattern**: Each row = one slide (image col + content col), similar to Cards block item pattern
- **Auto-rotation**: ~6 second interval, pauses on hover/focus for accessibility
- **Transitions**: CSS opacity/fade transitions for smooth slide changes
- **Accessibility**: ARIA tablist/tab/tabpanel roles, keyboard arrow navigation, reduced-motion support
- **Responsive breakpoint**: 900px (matching project's existing breakpoint)

## Files to Create/Modify

| File | Action |
|------|--------|
| `blocks/hero-banner-carousel/hero-banner-carousel.js` | **Create** |
| `blocks/hero-banner-carousel/hero-banner-carousel.css` | **Create** |
| `blocks/hero-banner-carousel/_hero-banner-carousel.json` | **Create** |
| `component-models.json` | **Modify** — add carousel model |
| `component-definition.json` | **Modify** — add carousel block definition |
| `component-filters.json` | **Modify** — add carousel filter |

> **Note:** Execution requires switching to Execute mode.
