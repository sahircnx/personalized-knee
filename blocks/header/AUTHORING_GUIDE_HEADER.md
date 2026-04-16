# Authoring Guide: Header Block

This guide explains how to author the content for the customized Header block on the Personalized Knee website. The header is driven by a central navigation document (usually `nav.docx` or `nav.md`).

## Navigation Document Structure

The navigation document is divided into three main sections, each represented by a Heading 1 (`#`) and a list.

### 1. Brand (Logo)
The first section defines the site logo and its destination link.

- **Format**: A single list item containing a link to the homepage, with the logo image inside the link text.
- **Example**:
  - `[/icon/logo.png](/)` (where `/icon/logo.png` is the image and `/` is the home link)

### 2. Sections (Main Navigation)
The second section defines the main navigation menu, including dropdowns.

- **Level 1 items**: Top-level links visible in the header.
- **Level 2 items**: Nested lists under a Level 1 item will automatically create a dropdown menu.
- **Example**:
  - [Understanding Knee Pain](understanding-knee-pain.html)
    - [Living with Knee Pain](understanding-knee-pain/living-with-knee-pain.html)
    - [Treatment Options](understanding-knee-pain/treatment-options.html)
    - [When to Take Action](understanding-knee-pain/knee-replacement.html)
  - [Patient Stories](patient-stories.html)
    - [Share Your Story](patient-stories/share-your-story.html)

### 3. Tools (CTA Buttons)
The third section defines the Call-to-Action (CTA) buttons on the right side of the header.

- **Button Types**:
  - **Glow Button**: Include the word "doctor" in the link text (e.g., "Find a doctor"). This will automatically apply the "glow" style and trigger the Find a Doctor modal.
  - **Stroke Button**: Include the word "quiz" in the link text (e.g., "Knee health quiz"). This will apply the outline/stroke style.
- **Example**:
  - [Find a doctor](#)
  - [Knee health quiz](knee-pain-quiz.html)

---

## Authoring the "Find a Doctor" Modal
The "Find a Doctor" modal is built directly into the header block logic. To trigger it:
1. Ensure the link text in the **Tools** section contains the word **"doctor"**.
2. The link URL can be `#` or any placeholder, as the JavaScript will intercept the click to open the modal.

## Responsive Behavior
- **Desktop (≥ 1200px)**: Shows the full logo, horizontal navigation with dropdowns on hover/click, and CTA buttons.
- **Mobile (< 1200px)**: Shows the logo, hamburger menu, and CTAs. Clicking the hamburger menu reveals the navigation and tools in a vertical stack.
