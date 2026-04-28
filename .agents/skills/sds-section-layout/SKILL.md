# SDS Section Layout Component

This skill explains the rules and best practices for using the `Section` component in the Simple Design System (SDS).

## Overview

The `Section` component is a fundamental layout primitive that creates page-level sections with consistent spacing, backgrounds, and borders. It's designed to span the full width of the page and act as a container for content blocks.

## Component Location

```typescript
import { Section } from "layout";
// Actual path: src/ds/ui/layout/Section/Section.tsx
```

## Key Principles

### 1. Full-Width Container

- **Sections always span the full page width**
- They act as horizontal content containers for all major page areas
- Content inside sections can be aligned as needed

### 2. Semantic HTML Elements

The Section component can render as three different HTML elements:

- `<section>` (default) - For generic content sections
- `<header>` - For page/site headers
- `<footer>` - For page/site footers

Use the `elementType` prop to specify which element to render.

### 3. Fixed Horizontal Padding

- Horizontal (x-axis) padding is **fixed** at `var(--sds-size-space-600)` (24px/1.5rem)
- This ensures consistent edge spacing across all sections
- **Do not override horizontal padding**

### 4. Variable Vertical Padding

Vertical (y-axis) padding is **configurable** using design tokens:

```typescript
padding?: "400" | "600" | "800" | "1200" | "1600" | "4000"
paddingTop?: "400" | "600" | "800" | "1200" | "1600" | "4000"
paddingBottom?: "400" | "600" | "800" | "1200" | "1600" | "4000"
```

These map to CSS variables:

- `400` = `var(--sds-size-space-400)` = 16px
- `600` = `var(--sds-size-space-600)` = 24px (default)
- `800` = `var(--sds-size-space-800)` = 32px
- `1200` = `var(--sds-size-space-1200)` = 48px
- `1600` = `var(--sds-size-space-1600)` = 64px
- `4000` = `var(--sds-size-space-4000)` = 160px

## Variants

The Section component supports five visual variants:

### 1. `subtle` (Default)

```tsx
<Section variant="subtle">{/* Content */}</Section>
```

- Transparent background
- No borders
- Default neutral appearance

### 2. `brand`

```tsx
<Section variant="brand">{/* Content */}</Section>
```

- Brand background color: `var(--sds-color-background-brand-default)`
- Text color: `var(--sds-color-text-brand-on-brand)`
- Icon colors automatically adjusted to `on-brand` variants
- Use for primary brand moments (heroes, CTAs, feature highlights)

### 3. `neutral`

```tsx
<Section variant="neutral">{/* Content */}</Section>
```

- Subtle gray background: `var(--sds-color-background-default-tertiary)`
- Use for visual separation between sections without heavy contrast

### 4. `stroke`

```tsx
<Section variant="stroke">{/* Content */}</Section>
```

- Transparent background with borders
- **Border rules (automatic):**
  - Top border added unless it's the first child
  - Bottom border added unless it's the last child
  - Adjacent `stroke` sections share borders (no double borders)
- Use for clear visual segmentation

### 5. `image`

```tsx
<Section variant="image" src="/path/to/image.jpg">
  {/* Content */}
</Section>
```

- Background image with scrim overlay
- Scrim color: `var(--sds-color-background-utilities-scrim)`
- Image positioned center and covers entire section
- Content appears above the scrim for readability

## Content Alignment Guidelines

### Single-Column Centered Content

When content is vertically stacked and centered:

```tsx
<Section>
  <Flex direction="column" alignPrimary="center">
    {/* Centered content */}
  </Flex>
</Section>
```

### Multi-Column Content

When content has multiple columns:

```tsx
<Section>
  <Flex direction="row" alignPrimary="start">
    {/* Left-aligned multi-column content */}
  </Flex>
</Section>
```

**Rule:** Multi-column layouts should be left-aligned, not centered.

## Usage Examples

### Example 1: Hero Section

```tsx
<Section elementType="section" variant="brand" padding="1600">
  <Flex direction="column" gap="600" alignPrimary="center">
    <TextContentTitle>Welcome to Our Product</TextContentTitle>
    <Text>Your journey starts here</Text>
    <Button variant="primary">Get Started</Button>
  </Flex>
</Section>
```

### Example 2: Header

```tsx
<Section elementType="header" variant="stroke" padding="400">
  <Flex direction="row" alignPrimary="space-between" alignSecondary="center">
    <Logo />
    <Navigation />
  </Flex>
</Section>
```

### Example 3: Footer

```tsx
<Section elementType="footer" variant="neutral" padding="1200">
  <Flex direction="column" gap="800">
    {/* Footer content */}
  </Flex>
</Section>
```

### Example 4: Content Section with Grid

```tsx
<Section variant="subtle" padding="1600">
  <Flex direction="column" gap="1200" container alignPrimary="center">
    <TextContentHeading>Features</TextContentHeading>
    <Flex direction="row" gap="600" type="third">
      <Card />
      <Card />
      <Card />
    </Flex>
  </Flex>
</Section>
```

### Example 5: Image Background Section

```tsx
<Section variant="image" src="/hero-background.jpg" padding="4000">
  <Flex direction="column" gap="600" alignPrimary="center">
    <TextContentTitle>Stunning Visuals</TextContentTitle>
    <Button variant="primary">Learn More</Button>
  </Flex>
</Section>
```

## Responsive Considerations

Sections maintain their horizontal padding across all breakpoints. For responsive vertical padding:

```tsx
import { useMediaQuery } from "hooks";

function ResponsiveSection() {
  const { isMobile } = useMediaQuery();

  return <Section padding={isMobile ? "600" : "1600"}>{/* Content */}</Section>;
}
```

## Best Practices

### ✅ DO

- Use Section as the outermost wrapper for page areas
- Use semantic element types (`elementType="header"` for headers)
- Combine with Flex component for inner content layout
- Use design token values for padding
- Let stroke borders handle themselves automatically
- Use brand variant for primary CTAs and hero moments

### ❌ DON'T

- Don't nest Sections inside Sections
- Don't override horizontal padding
- Don't use arbitrary padding values - only use the predefined token values
- Don't manually add borders - use the `stroke` variant
- Don't put raw content directly in Section - wrap in Flex or other layout components
- Don't use hardcoded colors - the variants handle color schemes automatically

## Integration with Other Components

Section works best when combined with:

- **Flex**: For arranging content inside the section
- **Typography components**: For text content (TextContentTitle, TextContentHeading, Text, etc.)
- **Button**: For actions within sections
- **Navigation**: For header sections
- **Cards**: For content grids within sections

## TypeScript Types

```typescript
export type SectionProps = ComponentPropsWithoutRef<
  "section" | "header" | "footer"
> & {
  elementType?: "section" | "header" | "footer";
  padding?: "400" | "600" | "800" | "1200" | "1600" | "4000";
  paddingTop?: "400" | "600" | "800" | "1200" | "1600" | "4000";
  paddingBottom?: "400" | "600" | "800" | "1200" | "1600" | "4000";
} & (
    | {
        variant?: "brand" | "neutral" | "stroke" | "subtle";
        src?: undefined;
      }
    | {
        variant: "image";
        src: string;
      }
  );
```

## Design Token Reference

All spacing uses SDS design tokens defined in [src/theme.css](../../../../src/theme.css):

```css
--sds-size-space-400: 1rem; /* 16px */
--sds-size-space-600: 1.5rem; /* 24px */
--sds-size-space-800: 2rem; /* 32px */
--sds-size-space-1200: 3rem; /* 48px */
--sds-size-space-1600: 4rem; /* 64px */
--sds-size-space-4000: 10rem; /* 160px */
```

## Related Skills

- [SDS Flexbox Layout](../sds-flexbox-layout/SKILL.md)
- [Code Connect Components](../code-connect-components/SKILL.md)
- [Implement Design](../implement-design/SKILL.md)

## Summary

The Section component is the foundational layout primitive for creating full-width page sections with consistent spacing and styling. Always use it as the outermost container for major page areas, leverage the variant system for different visual treatments, and combine it with Flex for inner content layout. Remember: fixed horizontal padding, variable vertical padding, and semantic HTML elements are key to proper usage.
