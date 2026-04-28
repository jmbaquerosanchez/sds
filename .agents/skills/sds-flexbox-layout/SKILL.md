# SDS Flex Layout Skill

## Purpose

Guide AI agents in correctly implementing responsive Flex layouts from Figma designs using the SDS component library.

## When to Use This Skill

- Implementing any grid or container layout from Figma
- Creating responsive multi-column layouts
- Aligning content with precise spacing and distribution
- Building card grids, feature sections, or content panels

## Dependencies

- CSS variables from [src/theme.css](src/theme.css) (spacing tokens)
- Responsive breakpoints from [src/responsive.css](src/responsive.css)
- Related components: Section (for page-level structure)

## Figma Guidance

- SDS does **not** rely on Figma grid styles; all grid rules are enforced through Flex auto layout (see Flex documentation node in Figma).
- Layout is built with two components: **Flex** (containers) and **FlexItem** (explicit child sizing). Any child of `Flex` behaves as an item, but use `FlexItem` when a design calls out named spans (Full, Major, Minor, Half).
- Container alignment options map to four grid systems: Auto, Quarter, Third, and Half. Items snap to Minor, Major, Half, or Full spans, collapsing to full width on mobile. Always enable wrapping when a design shows multi-line grids.

## Flex Component Essentials

- API lives in [src/ds/ui/layout/Flex/Flex.tsx](src/ds/ui/layout/Flex/Flex.tsx#L1-L43). Key props:
  - `alignPrimary` → justifies items along the main axis (`start` | `end` | `center` | `stretch` | `space-between`).
  - `alignSecondary` → aligns items on the cross axis with the same tokens as `alignPrimary`.
  - `direction` → flex direction (`row`, `row-reverse`, `column`, `column-reverse`).
  - `gap` → spacing token that maps to `var(--sds-size-space-*)` in CSS (`100` through `1600`).
  - `type` → responsive grid preset (`auto`, `quarter`, `third`, `half`). Controls how item spans are converted into column ratios.
  - `container` → centers the flex block and bounds it to `--global-container-max-width` via the `.flex-container` rule.
  - `wrap` → must be `true` whenever the design shows more items than fit on one row.
- The component injects CSS custom properties (`--flex-align-*`, `--flex-direction`) so downstream CSS stays token-driven.

## FlexItem Essentials

- Implementation: [src/ds/ui/layout/Flex/Flex.tsx](src/ds/ui/layout/Flex/Flex.tsx#L45-L60).
- `size` prop options: `full`, `major`, `minor`, `half`, `fill`.
  - `full`, `major`, `minor`, `half` map to the responsive column ratios described below.
  - `fill` ignores grid math and simply `flex-grow: 1`, useful in toolbars.

## Grid Type Selection

Choose the correct `type` prop based on the Figma layout:

- **Auto** - Items size naturally based on content; no Figma grid annotations or column system specified
- **Quarter** - 4-column system (Major=3 cols, Minor=1 col spans) → 3:1 ratio
- **Third** - 3-column system (Major=2 cols, Minor=1 col spans) → 2:1 ratio
- **Half** - 2-column system (all items equal width) → 1:1 ratio

## Responsive Ratios & Breakpoints

- Ratio tokens are defined in [src/responsive.css](src/responsive.css#L1-L36) and change at 600px (tablet) and 1024px (desktop).
  - **Mobile (<600px):** Half = 2 columns, Quarter Major/Minor = 4, Third Major/Minor = 3 → every item becomes effectively full width.
  - **Tablet (≥600px):** Half collapses to 1 (two-up), Quarter Major/Minor = 2, Third remains 3.
  - **Desktop (≥1024px):** Half = 1, Quarter Major = 3 vs Quarter Minor = 1 (2/1 split), Third Major = 2 vs Third Minor = 1 (2/1 split).
- Because `Flex` recomputes `--column-major` / `--column-minor` based on `type`, these ratios produce the Minor/Major pairings shown in the Figma reference tables for desktop, tablet, and mobile.

## CSS Behavior Highlights

- Core rules live in [src/ds/ui/layout/Flex/flex.css](src/ds/ui/layout/Flex/flex.css#L1-L84):
  - `.flex-container` centers content and clamps width.
  - `.flex-type-*` presets set `--column-major` / `--column-minor`, which downstream `FlexItem` spans use to determine `flex-basis` and `max-width`.
  - `.flex-direction-column` with `alignSecondary="stretch"` forces children to full width for stacked layouts.
  - `.flex-type-auto.flex-align-primary-stretch` lets non-`FlexItem` children expand evenly when the design omits span tokens.
  - Gap modifiers (`flex-gap-100` … `flex-gap-1600`) map to SDS spacing tokens—never hardcode pixel gaps.
  - `.flex-wrap` simply toggles `flex-wrap: wrap`; set it whenever the Figma table shows multiple rows.

## Common Pitfalls

- ❌ **Don't hardcode pixel gaps** - Always use gap tokens (`100` through `1600`), never `gap="16px"`
- ❌ **Don't forget `wrap={true}`** - Required for multi-row layouts; without it, items will overflow
- ❌ **Don't mix FlexItem sizing with custom CSS** - Avoid setting width rules that conflict with flex-basis calculations
- ❌ **Don't use `type="auto"` when Figma specifies columns** - Match the grid system (Quarter/Third/Half) to maintain design fidelity
- ❌ **Don't nest `container` props** - Only use `container` on the outermost Flex of a section

## Working Pattern

1. **Identify the grid** (Auto, Quarter, Third, Half) from the Figma annotations.
2. **Wrap items** with `FlexItem` when the design labels spans (Full, Major, Minor, Half) so the CSS ratios kick in.
3. **Choose direction and alignment** to match the design’s main axis; use `alignSecondary="stretch"` for cards that should share equal height.
4. **Apply spacing tokens** through the `gap` prop instead of manual margins.
5. **Toggle `container`** when the layout should align with the global page frame; leave it off for nested flex stacks.
6. **Verify breakpoints** by resizing Storybook (see [src/ds/stories/layout/Flex.stories.tsx](src/ds/stories/layout/Flex.stories.tsx#L1-L63)) to confirm that Minor/Major spans collapse to full width on mobile, matching the Figma tables.

## Example

```tsx
import { Flex, FlexItem } from "layout";

export function FeatureGrid() {
  return (
    <Flex container type="quarter" gap="400" wrap alignSecondary="stretch">
      <FlexItem size="full">Hero Card</FlexItem>
      <FlexItem size="major">Primary Feature</FlexItem>
      <FlexItem size="minor">Supporting</FlexItem>
      <FlexItem size="minor">Supporting</FlexItem>
      <FlexItem size="half">Secondary Block</FlexItem>
      <FlexItem size="half">Secondary Block</FlexItem>
    </Flex>
  );
}
```

- This configuration mirrors the desktop table in the Figma note: the `full` item spans the full row, `major`/`minor` combine into 3/1 splits, and `half` creates two even columns at desktop but stack on mobile.

Keep this document nearby whenever you translate Flex-based sections from Figma; it encodes both the design annotations and the exact SDS behaviors needed to implement them correctly.
