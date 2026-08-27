---
name: High Performance SaaS
colors:
  surface: '#fcf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fcf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ed'
  surface-container: '#f0eee7'
  surface-container-high: '#eae8e2'
  surface-container-highest: '#e5e2dc'
  on-surface: '#1b1c18'
  on-surface-variant: '#44474d'
  inverse-surface: '#30312d'
  inverse-on-surface: '#f3f1ea'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#4d5f7e'
  primary: '#051934'
  on-primary: '#ffffff'
  primary-container: '#1c2e4a'
  on-primary-container: '#8496b7'
  inverse-primary: '#b5c7ea'
  secondary: '#4b6076'
  on-secondary: '#ffffff'
  secondary-container: '#cce2fc'
  on-secondary-container: '#50657b'
  tertiary: '#121925'
  on-tertiary: '#ffffff'
  tertiary-container: '#272e3a'
  on-tertiary-container: '#8e95a4'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3ff'
  primary-fixed-dim: '#b5c7ea'
  on-primary-fixed: '#071c37'
  on-primary-fixed-variant: '#364765'
  secondary-fixed: '#cfe5ff'
  secondary-fixed-dim: '#b3c9e2'
  on-secondary-fixed: '#051d30'
  on-secondary-fixed-variant: '#34495d'
  tertiary-fixed: '#dce3f3'
  tertiary-fixed-dim: '#c0c7d7'
  on-tertiary-fixed: '#151c27'
  on-tertiary-fixed-variant: '#404754'
  background: '#fcf9f3'
  on-background: '#1b1c18'
  surface-variant: '#e5e2dc'
  deep-navy-bg: '#0F1A2B'
  surface-ivory: '#BDC4D4'
  base-buttercream: '#D1CFC9'
typography:
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  data-display:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-margin: 24px
  grid-gutter: 16px
  bento-gap: 12px
  container-padding: 20px
---

## Brand & Style

The design system is engineered for the modern personal trainer—balancing the technical precision of financial software with the disciplined energy of high-performance fitness. The brand personality is professional, structured, and outcome-oriented, stripping away distractions to prioritize data clarity and operational efficiency.

The aesthetic follows a **Corporate / Modern** approach with a heavy emphasis on **Bento Box layouts**. This modular structure allows for dense, high-impact data visualizations—such as concentric workout rings and performance heatmaps—while maintaining a clean, organized hierarchy. The interface should feel like a sophisticated dashboard where every pixel is dedicated to tracking progress and optimizing results.

## Colors

This color palette adopts a mature, technological tone. **Midnight Blue** serves as the primary driver for brand identity, critical call-to-actions, and main headings. **Deep Navy** provides the necessary depth for structural elements like sidebars or dark-mode surfaces.

To ensure visual comfort during long management sessions, **Buttercream** is used as the base canvas color. **Ivory** is reserved for elevated surfaces such as client cards and training blocks, creating a subtle contrast against the base. **Dusty Blue** acts as the functional bridge for supporting UI elements, including inactive states and table borders.

## Typography

The typography system prioritizes the legible rendering of complex numerical data (weights, reps, and payments). **Plus Jakarta Sans** is used for headings and display data to provide a modern, geometric structure. **Inter** is utilized for body copy and UI labels due to its exceptional clarity at small scales and neutral, professional character.

For mobile devices, headlines scale down to ensure they do not dominate the viewport, maintaining a compact and information-dense layout. All data-heavy components should leverage the SemiBold and Bold weights to ensure key metrics are immediately scannable.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for desktop to maintain a "Bento Box" dashboard feel, while transitioning to a fluid, single-column stack on mobile. 

The layout relies on a tight 12-column grid with 16px gutters. "Bento" cards should span specific column groups (e.g., 3, 4, 6, or 12) to create an organized, tiled appearance. For tablet and desktop, a standard 24px outer margin provides breathing room, while mobile reduces this to 16px to maximize screen real estate for data tables and charts.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layers** rather than heavy shadows. The primary surface is the **Buttercream** background. Interactive or secondary containers (Cards) are elevated using the **Ivory** surface. 

To maintain the clean, "Bento" aesthetic, use **Low-contrast outlines** (1px solid borders in Dusty Blue at 20% opacity) instead of traditional drop shadows. If a shadow is required for temporary overlays like dropdowns or modals, use a tight, highly diffused navy tint (`rgba(15, 26, 43, 0.08)`) to preserve the professional, software-first feel.

## Shapes

The shape language is precise and disciplined. A subtle **Soft** roundedness (4px to 6px) is applied to all primary containers, buttons, and input fields. This avoids the playfulness of fully rounded "pill" shapes, aligning instead with a more professional, technical software aesthetic. Large Bento cards may use a slightly larger radius (8px) to soften the overall grid while remaining strictly geometric.

## Components

### Buttons
- **Primary:** Midnight Blue background, white text, 4-6px border radius. Bold weight.
- **Secondary:** Dusty Blue border, Dusty Blue text, transparent background.
- **Icon Buttons:** Use 1.5px stroke weight (Lucide style) for icons, centered within a square Ivory container.

### Bento Cards
Cards are the core of the UI. Use Ivory backgrounds with a 1px Dusty Blue border. Each card should have a clear title in Headline-SM. Content inside cards (charts, lists) should have consistent 16px internal padding.

### Data Visualization
- **Concentric Rings:** Used for daily goal completion. Use Midnight Blue for the primary progress and Dusty Blue for the empty track.
- **Heatmaps:** Used for client activity. Use a sequential scale from Ivory to Midnight Blue.

### Input Fields
Strict 4px border radius. Use a 1px border in Dusty Blue. On focus, the border shifts to Midnight Blue with a subtle 2px outer glow in the same hue.

### Chips & Tags
Small, 4px rounded labels with high contrast text for "Status" indicators (e.g., "Active", "Paid", "Pending"). Use tinted versions of the brand colors for background fills.