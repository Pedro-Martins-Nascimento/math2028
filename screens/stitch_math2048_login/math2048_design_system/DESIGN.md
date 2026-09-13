---
name: Arcade Neo-Brutalism
colors:
  surface: '#150f28'
  surface-dim: '#150f28'
  surface-bright: '#3c3550'
  surface-container-lowest: '#100a23'
  surface-container-low: '#1e1831'
  surface-container: '#221c35'
  surface-container-high: '#2c2640'
  surface-container-highest: '#37314c'
  on-surface: '#e8ddff'
  on-surface-variant: '#cdc7aa'
  inverse-surface: '#e8ddff'
  inverse-on-surface: '#332c47'
  outline: '#979177'
  outline-variant: '#4b4731'
  surface-tint: '#dec800'
  primary: '#ffffff'
  on-primary: '#373100'
  primary-container: '#fde400'
  on-primary-container: '#716500'
  inverse-primary: '#6a5f00'
  secondary: '#ffb1c4'
  on-secondary: '#65002e'
  secondary-container: '#da036b'
  on-secondary-container: '#fff1f2'
  tertiary: '#ffffff'
  on-tertiary: '#00363a'
  tertiary-container: '#7df4ff'
  on-tertiary-container: '#006f77'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#fde400'
  primary-fixed-dim: '#dec800'
  on-primary-fixed: '#201c00'
  on-primary-fixed-variant: '#504700'
  secondary-fixed: '#ffd9e0'
  secondary-fixed-dim: '#ffb1c4'
  on-secondary-fixed: '#3f001a'
  on-secondary-fixed-variant: '#8f0044'
  tertiary-fixed: '#7df4ff'
  tertiary-fixed-dim: '#00dbe9'
  on-tertiary-fixed: '#002022'
  on-tertiary-fixed-variant: '#004f54'
  background: '#150f28'
  on-background: '#e8ddff'
  surface-variant: '#37314c'
  arcade-yellow: '#FFE600'
  arcade-pink: '#FF3385'
  arcade-cyan: '#00F0FF'
  arcade-green: '#39FF88'
  arcade-orange: '#FF7A00'
  arcade-purple: '#8A3FFC'
  board-bg: '#251545'
  surface-card: '#251842'
  surface-banner: '#381F68'
  slot-recessed: '#1A0C33'
  tile-mint: '#A8FFD6'
  tile-lemon: '#FFF490'
  tile-peach: '#FFB37C'
  tile-red: '#FF3366'
  tile-gold: '#FFE600'
  tile-master: '#FF9F00'
  text-muted-lavender: '#E5B8F4'
typography:
  headline-xl:
    fontFamily: Fredoka
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Fredoka
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Fredoka
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Fredoka
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '800'
    lineHeight: 22px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 18px
  label-lg:
    fontFamily: Fredoka
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.05em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '800'
    lineHeight: 14px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 9px
    fontWeight: '800'
    lineHeight: 12px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

Arcade Neo-Brutalism fuses the tactile, high-energy world of retro 90s arcade cabinets with modern neo-brutalist aesthetics. It evokes excitement, kinetic rhythm, and nostalgic playfulness through vibrant saturated pop tones, ultra-bold black borders (2px to 4px), hard-drop offset shadows with zero blur, and rounded pill badges.

The design movement relies on:
- **Neo-Brutalism:** Pure black `#000000` boundaries, offset drop shadows (hard 2px, 4px, and 6px shifts with 0px blur), and bold interactive push-down feedback states (`translate(3px, 3px)`).
- **Arcade Cyber-Pop:** Deep dark cosmic purple backgrounds paired against high-voltage accents: arcade yellow, neon cyan, shock pink, lime electric green, and energetic orange.
- **Expressive Micro-Surfaces:** High contrast labels with black background pill tabs, dropped text shadows, and bouncy scale keyframe animations.

## Colors

The color system centers around high-voltage retro gaming contrasted against a midnight deep-violet shell.

- **Primary (`#FFE600`):** Electric Arcade Yellow. Used for primary badges, score focus surfaces, high-tier game tiles, and active navigation indicators.
- **Secondary (`#FF3385`):** Shock Arcade Pink. Used for secondary focus banners, high-score records, and critical callout tags.
- **Tertiary (`#00F0FF`):** Cyber Cyan. Used for action items (New Game CTA), logo highlights, and multiplier headers.
- **Neutral Surface Canvas (`#18122B`):** Deep plum void background that allows neon elements to pop without straining the eyes.
- **Supportive Accents:** Lime `#39FF88` (success, level status, settings button), Neon Amber `#FF7A00` (combo markers), and Punchy Violet `#8A3FFC` (stats actions).
- **Borders & Shadows:** Always pure `#000000` with 100% opacity.

## Typography

The typography pairs the bubbly, blocky arcade nature of **Fredoka** with the geometric legibility of **Plus Jakarta Sans**.

- **Display & Headings (Fredoka):** Used for large score values, block numbers, title branding, and action button labels. It gives the product an immediate vintage console and coin-op feeling.
- **Body & Metadata (Plus Jakarta Sans):** Heavily weighted (weights 600 through 900) to keep balance with the aggressive borders and bold UI architecture.
- **Labels & Tags:** Uppercase, wide letter-spaced badges (`tracking-widest` or `tracking-wide`) wrapped in contrasting dark capsules to mimic arcade cabinet chassis decals.

## Layout & Spacing

The interface employs a centered single-column mobile-first layout (constrained to `max-w-[460px]`), optimized for one-thumb touch gameplay.

- **Grid System:** The game board utilizes a rigid 4x4 square grid layout with balanced `gap-3` (0.75rem) spacing.
- **Rhythm:** Compact component spacing (typically `0.5rem` to `1rem`) keeps the entire HUD and playable board above the fold without requiring vertical scrolling.
- **Safe Padding:** Outer canvas uses a base horizontal margin of `1rem` with an extended bottom padding of `6rem` (`pb-24`) to clear the sticky neo-brutalist navigation dock.

## Elevation & Depth

Arcade Neo-Brutalism relies purely on **hard-edged physical extrusion** rather than blurred ambient shadows or tonal lighting:

- **Borders:** All structural surfaces have explicit dark borders (`border-2`, `border-3`, or `border-4` using `#000000`).
- **Hard Offset Drop Shadows:**
  - Small elements / action buttons: `2px 2px 0px #000000`
  - Cards, score containers, banners: `4px 4px 0px #000000`
  - Playboard master container: `6px 6px 0px #000000`
  - Accent colored shadows (for special highlights): `4px 4px 0px #FFE600` or `#FF4B91`
- **Tactile Click States:** Buttons physically compress when clicked via `translate(3px, 3px)` accompanied by shadow collapse to `1px 1px 0px #000000`.
- **Sunken Elements:** Empty grid slots use dark interior recesses (`#1a0c33`) with subdued purple borders (`#3d246c`) to convey empty socket trays ready to receive tiles.

## Shapes

The design balances neo-brutalist rigidity with approachable arcade pill curves:

- **Rounded Corners:** Base radius is rounded-xl (`12px` to `16px`) for tiles and cards, with larger structural units (main board, top banner, score containers) utilizing `rounded-2xl` (`16px`) or `rounded-3xl` (`24px`).
- **Pill Tags:** Secondary indicators, badges, and status meters use full pill rounding (`rounded-full`) to contrast against the blocky grid cells.
- **Badge Angles:** Occasional playful dynamic tilts (e.g., `-4deg` rotation) on mini tags to create a spontaneous sticker effect.

## Components

### Buttons
- **Neo-Brutal Action Buttons:** Thick solid black outline (2px or 3px), filled with bright neon surface (Cyan `#00F0FF`, Lime `#39FF88`, or Yellow `#FFE600`).
- **Typography:** Bold Fredoka or heavy Plus Jakarta Sans, fully uppercase with generous icon pairings.
- **Interaction:** Must include `:active` state that translates 2px-3px down-right with immediate shadow reduction.

### Score & Stat Cards
- Saturated solid fills (Yellow `#FFE600`, Hot Pink `#FF3385`) bordered in 3px solid black with a 4px black shadow.
- Feature decorative semi-opaque background watermarks (e.g., `PTS`, `MAX`) rotated in the corner.
- Include a high-contrast pill header tag (black background with crisp white or yellow text).

### Game Board & Tiles
- **Tray:** Deep purple (`#251545`) enclosure framed in 4px black border with 6px offset shadow.
- **Empty Slots:** Inset dark purple wells (`#1a0c33`) with subtle purple outlines (`#3d246c`).
- **Numbered Tiles:** Vibrantly keyed by value:
  - Low tiers (2, 4, 8): Pastel punch (Mint `#A8FFD6`, Lemon `#FFF490`, Peach `#FFB37C`) with black numerals.
  - Mid tiers (16, 32, 64): High-voltage Strawberry `#FF3366` with white text and black text shadows.
  - Legendary tiers (256, 1024, 2048): Gilded Amber (`#FFE600`, `#FF9F00`) equipped with micro sparkles, highlight ribbons, and pulsing scale effects.

### Navigation Bar
- Fixed bottom bar pinned to screen edge with a 4px solid black top divider.
- Active states represented by fully colored neo-brutalist button capsules rather than subtle line indicators.

### Status Ribbons / Banners
- Horizontal cards wrapped in 3px black borders containing inline chip counters (`COMBO`, `MULTIPLIER`) and glowing animated pulse indicators.