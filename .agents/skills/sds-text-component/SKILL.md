# SDS Text Component

This skill explains the rules and best practices for using text components in the Simple Design System (SDS).

## Overview

The SDS Text component system provides a comprehensive set of typography primitives built on React Aria Components, offering semantic HTML elements, consistent styling through CSS variables, and support for inline text styling, truncation, and accessibility.

## Component Location

```typescript
import {
  Text,
  TextSmall,
  TextSmallStrong,
  TextStrong,
  TextEmphasis,
  TextLink,
  TextCode,
  TextTitleHero,
  TextTitlePage,
  TextSubtitle,
  TextHeading,
  TextSubheading,
  TextContentHeading,
  TextContentTitle,
  TextPrice,
  TextList,
  TextLinkList,
  TextListItem,
} from "primitives";
// Actual path: src/ds/ui/primitives/Text/Text.tsx
```

## Key Principles from Figma

Based on the Figma design system guidance:

### 1. Inline Style Overrides for Body Content ✅

**Recommended for short text with mixed styling:**

```tsx
<Text>
  We recommend using inline style overrides e.g.{" "}
  <TextStrong>bold (strong)</TextStrong>,{" "}
  <TextEmphasis>italic (emphasis)</TextEmphasis>,{" "}
  <TextLink href="#">or underlines</TextLink> for body content.
</Text>
```

- Use `<TextStrong>` for **bold text** (renders as `<strong>`)
- Use `<TextEmphasis>` for _italic text_ (renders as `<em>`)
- Use `<TextLink>` for underlined links
- Inline styles preserve semantic HTML while allowing mixed formatting

### 2. Consistent Text Styles for Longer Content ✅

**Recommended for longer, uniformly styled text:**

```tsx
<TextStrong>
  For longer, more consistently styled text strings, implementing variables
  within a text style will align a lot closer to code.
</TextStrong>
```

- Apply a single text style component to the entire text block
- Better performance and maintainability
- Aligns with design system tokens
- Creates consistency across the application

### 3. Avoid Inline Overrides for Large Blocks ❌

**Figma doesn't recommend inline style overrides for large blocks of text.**

Instead:

```tsx
// ❌ DON'T: Mix styles in large blocks
<Text>
  This is a very long paragraph... <TextStrong>with some bold</TextStrong> and{" "}
  <TextEmphasis>italic text</TextEmphasis> scattered throughout many
  sentences...
</Text>

// ✅ DO: Use a consistent style
<TextStrong>
  This is a very long paragraph with consistent styling throughout that
  maintains visual hierarchy...
</TextStrong>
```

## Typography Hierarchy

### Title Components (Hero)

```tsx
<TextTitleHero>The Main Hero Title</TextTitleHero>
```

- **Font:** `var(--sds-font-title-hero)` (72px, Bold, 900 weight)
- **Element:** `h1` (default)
- **Usage:** Page hero sections, landing page headlines
- **Design Token:** `var(--sds-typography-title-hero-size)` = 72px

### Title Components (Page)

```tsx
<TextTitlePage>Page Level Title</TextTitlePage>
```

- **Font:** `var(--sds-font-title-page)` (48px, Bold, 700 weight)
- **Element:** `h2` (default)
- **Usage:** Main page titles, section headers
- **Design Token:** `var(--sds-typography-title-page-size-base)` = 48px

### Subtitle Components

```tsx
<TextSubtitle>Supporting subtitle text</TextSubtitle>
```

- **Font:** `var(--sds-font-subtitle)` (32px, Regular)
- **Element:** `p` (default)
- **Usage:** Subheadings under titles, descriptive text
- **Design Token:** `var(--sds-typography-subtitle-size-base)` = 32px

### Heading Components

```tsx
<TextHeading>Section Heading</TextHeading>
```

- **Font:** `var(--sds-font-heading)` (24px, Semi Bold, 600 weight)
- **Element:** `h3` (default)
- **Usage:** Section headings, card titles
- **Design Token:** `var(--sds-typography-heading-size-base)` = 24px

### Subheading Components

```tsx
<TextSubheading>Section subheading</TextSubheading>
```

- **Font:** `var(--sds-font-subheading)` (20px, Regular)
- **Element:** `p` (default)
- **Usage:** Descriptive text under headings
- **Design Token:** `var(--sds-typography-subheading-size-medium)` = 20px

### Body Components

#### Base Text

```tsx
<Text>Standard body text content</Text>
```

- **Font:** `var(--sds-font-body-base)` (16px, Regular, 400 weight)
- **Element:** `p` (default)
- **Line Height:** 1.4 (default)
- **Usage:** Primary body content, paragraphs
- **Design Token:** `var(--sds-typography-body-size-medium)` = 16px

#### Small Text

```tsx
<TextSmall>Smaller supporting text</TextSmall>
```

- **Font:** `var(--sds-font-body-small)` (14px, Regular)
- **Element:** `small` (default)
- **Usage:** Captions, fine print, metadata
- **Design Token:** `var(--sds-typography-body-size-small)` = 14px

#### Strong Text

```tsx
<TextStrong>Important emphasized text</TextStrong>
```

- **Font:** `var(--sds-font-body-strong)` (16px, Semi Bold, 600 weight)
- **Element:** `strong` (default)
- **Usage:** Emphasis, important content
- **Design Token:** `var(--sds-typography-body-font-weight-strong)` = 600

#### Small Strong Text

```tsx
<TextSmallStrong>Small emphasized text</TextSmallStrong>
```

- **Font:** `var(--sds-font-body-small-strong)` (14px, Semi Bold, 600 weight)
- **Element:** `small` (default)
- **Usage:** Labels, small emphasized content

#### Emphasis Text

```tsx
<TextEmphasis>Italicized emphasis</TextEmphasis>
```

- **Font:** `var(--sds-font-body-emphasis)` (16px, Italic)
- **Element:** `em` (default)
- **Usage:** Subtle emphasis, quotations

#### Link Text

```tsx
<TextLink href="/path">Link text</TextLink>
```

- **Font:** `var(--sds-font-body-link)` (16px)
- **Style:** Underlined with focus ring support
- **Element:** Renders as `<Link>` component
- **Usage:** Inline text links

#### Code Text

```tsx
<TextCode>const code = 'example';</TextCode>
```

- **Font:** `var(--sds-font-body-code)` (16px, Mono)
- **Family:** `var(--sds-typography-family-mono)` = "Roboto Mono"
- **Usage:** Inline code snippets

## Common Props

### Shared Props (Most Text Components)

```typescript
type TextProps = {
  /**
   * Custom CSS class name
   */
  className?: string;

  /**
   * HTML element to render
   * @default varies by component (p, h1, h2, etc.)
   */
  elementType?: string;

  /**
   * Line height variant
   * @default "body"
   */
  lineHeight?: "body" | "single";

  /**
   * Truncate text with ellipsis after N lines
   * Applies CSS line-clamp
   */
  lineClamp?: number;

  /**
   * Children content
   */
  children?: React.ReactNode;
};
```

## Line Height Options

```tsx
// Body line height (1.4 - default)
<Text lineHeight="body">Multiple line text with comfortable spacing</Text>

// Single line height (1.0)
<Text lineHeight="single">Single line text with no extra spacing</Text>
```

- **`body`** (default): `var(--global-line-height-body)` = 1.4
- **`single`**: 1.0 - useful for headings or compact layouts

## Text Truncation

Apply ellipsis truncation to any text component:

```tsx
// Truncate after 2 lines
<Text lineClamp={2}>
  This is a long text that will be truncated after two lines with an ellipsis
  at the end...
</Text>

// Truncate after 3 lines
<TextHeading lineClamp={3}>
  Long heading text that gets truncated after three lines
</TextHeading>
```

- Uses CSS `line-clamp` under the hood
- Works with all text components that support `lineClamp` prop
- Automatically adds ellipsis (`...`)

## Composite Components

### TextContentHeading

Groups heading and subheading together:

```tsx
<TextContentHeading
  heading="Main Section Title"
  subheading="Optional supporting text"
  align="center" // or "start" (default)
/>
```

**Renders:**

```tsx
<Flex direction="column" gap="200">
  <TextHeading>Main Section Title</TextHeading>
  <TextSubheading>Optional supporting text</TextSubheading>
</Flex>
```

### TextContentTitle

Groups title and subtitle together with responsive sizing:

```tsx
<TextContentTitle
  title="Hero Title Text"
  subtitle="Supporting subtitle"
  align="center" // or "start" (default)
/>
```

- **Desktop:** Uses `TextTitleHero` (72px)
- **Mobile:** Uses `TextTitlePage` (48px)
- Automatically responsive via `useMediaQuery()`

### TextPrice

Specialized component for pricing display:

```tsx
<TextPrice currency="$" price="99" label="/ month" size="large" />
```

**Props:**

```typescript
type TextPriceProps = {
  /**
   * Currency symbol
   */
  currency: string;

  /**
   * Price value
   */
  price: string;

  /**
   * Optional label (e.g., "/ month")
   */
  label?: string;

  /**
   * Size variant
   * @default "large"
   */
  size?: "small" | "large";
};
```

**Renders:**

- **Small:** Uses `TextHeading` for price
- **Large:** Uses `TextTitlePage` for price
- Currency shown as superscript
- Optional label in `TextSmall`

### TextList

Flexible list component with variants:

```tsx
<TextList
  title="List Title"
  density="default" // or "tight"
>
  <TextListItem>First item</TextListItem>
  <TextListItem>Second item</TextListItem>
  <TextListItem>Third item</TextListItem>
</TextList>
```

**Props:**

```typescript
type TextListProps = {
  /**
   * Optional list title
   */
  title?: ReactNode;

  /**
   * Spacing density
   * @default "default"
   */
  density?: "default" | "tight";

  children?: ReactNode;
};
```

**Density Spacing:**

- **`default`**: Gap of `var(--sds-size-space-300)` (12px), title margin `var(--sds-size-space-400)` (16px)
- **`tight`**: Gap of `var(--sds-size-space-200)` (8px), title margin `var(--sds-size-space-100)` (4px)

### TextLinkList

List variant without bullets for navigation links:

```tsx
<TextLinkList title="Quick Links">
  <TextListItem>
    <TextLink href="/home">Home</TextLink>
  </TextListItem>
  <TextListItem>
    <TextLink href="/about">About</TextLink>
  </TextListItem>
</TextLinkList>
```

- No list-style markers
- No left padding
- Commonly used in footers and navigation menus

## Text Alignment

Apply alignment classes to any text component:

```tsx
<Text className="text-align-start">Left aligned text</Text>
<Text className="text-align-center">Center aligned text</Text>
<Text className="text-align-end">Right aligned text</Text>
```

- **`text-align-start`**: Left-aligned
- **`text-align-center`**: Center-aligned
- **`text-align-end`**: Right-aligned

## Design Tokens Reference

All text styles use CSS custom properties from the design system:

### Font Families

```css
--sds-typography-family-sans: "inter", sans-serif
--sds-typography-family-serif: "noto serif", serif
--sds-typography-family-mono: "roboto mono", monospace
```

### Font Sizes

```css
--sds-typography-scale-01: 0.75rem (12px)
--sds-typography-scale-02: 0.875rem (14px)
--sds-typography-scale-03: 1rem (16px)
--sds-typography-scale-04: 1.25rem (20px)
--sds-typography-scale-05: 1.5rem (24px)
--sds-typography-scale-06: 2rem (32px)
--sds-typography-scale-07: 2.5rem (40px)
--sds-typography-scale-08: 3rem (48px)
--sds-typography-scale-09: 4rem (64px)
--sds-typography-scale-10: 4.5rem (72px)
```

### Font Weights

```css
--sds-typography-weight-regular: 400
--sds-typography-weight-medium: 500
--sds-typography-weight-semibold: 600
--sds-typography-weight-bold: 700
--sds-typography-weight-extra-bold: 800
--sds-typography-weight-black: 900
```

### Text Colors

```css
/* Default text colors (light mode) */
--sds-color-text-default-default: var(--sds-color-gray-900)
--sds-color-text-default-secondary: var(--sds-color-gray-500)
--sds-color-text-default-tertiary: var(--sds-color-gray-400)

/* Brand text colors */
--sds-color-text-brand-default: var(--sds-color-brand-800)
--sds-color-text-brand-on-brand: var(--sds-color-brand-100)

/* Neutral text colors */
--sds-color-text-neutral-default: var(--sds-color-slate-900)
--sds-color-text-neutral-on-neutral: var(--sds-color-slate-100)
```

**Note:** Dark mode variants automatically apply via `@media (prefers-color-scheme: dark)`

## Best Practices

### ✅ DO

1. **Use semantic component names:**

   ```tsx
   <TextHeading>Section Title</TextHeading>
   <Text>Body paragraph content</Text>
   ```

2. **Use inline styles for short mixed content:**

   ```tsx
   <Text>
     Normal text with <TextStrong>bold</TextStrong> and{" "}
     <TextEmphasis>italic</TextEmphasis>
   </Text>
   ```

3. **Use consistent styles for longer text:**

   ```tsx
   <TextStrong>
     An entire paragraph that needs emphasis throughout
   </TextStrong>
   ```

4. **Match semantic HTML with design hierarchy:**

   ```tsx
   <TextTitleHero elementType="h1">Page Title</TextTitleHero>
   <TextHeading elementType="h2">Section Title</TextHeading>
   ```

5. **Use truncation for dynamic content:**

   ```tsx
   <Text lineClamp={2}>{dynamicUserContent}</Text>
   ```

6. **Let CSS variables handle theming:**
   ```tsx
   {/* Colors automatically adjust for dark mode */}
   <Text>Themed text content</Text>
   ```

### ❌ DON'T

1. **Don't use inline overrides for large blocks:**

   ```tsx
   {/* ❌ Too many inline styles */}
   <Text>
     Very long paragraph... <TextStrong>bold here</TextStrong> and{" "}
     <TextEmphasis>italic there</TextEmphasis>... more text...
   </Text>
   ```

2. **Don't hardcode colors:**

   ```tsx
   {/* ❌ Breaks theming */}
   <Text style={{ color: "#111111" }}>Text</Text>

   {/* ✅ Use CSS variables */}
   <Text style={{ color: "var(--sds-color-text-default-default)" }}>
     Text
   </Text>
   ```

3. **Don't skip semantic hierarchy:**

   ```tsx
   {/* ❌ Wrong semantic order */}
   <TextHeading elementType="h1">Page Title</TextHeading>

   {/* ✅ Correct semantic order */}
   <TextTitleHero elementType="h1">Page Title</TextTitleHero>
   ```

4. **Don't use wrong component for visual needs:**

   ```tsx
   {/* ❌ Wrong semantic meaning */}
   <TextHeading>This is just body text</TextHeading>

   {/* ✅ Use appropriate component */}
   <Text>This is just body text</Text>
   ```

5. **Don't override font families directly:**
   ```tsx
   {/* ❌ Breaks design system */}
   <Text style={{ fontFamily: "Arial" }}>Text</Text>
   ```

## Common Patterns

### Page Hero Section

```tsx
<Section variant="default" padding="1600">
  <Flex direction="column" gap="600" alignPrimary="center">
    <TextContentTitle
      title="Welcome to Our Platform"
      subtitle="Build amazing experiences with our design system"
      align="center"
    />
    <Button variant="primary" size="large">
      Get Started
    </Button>
  </Flex>
</Section>
```

### Content Section with Heading

```tsx
<Section variant="stroke" padding="1200">
  <Flex direction="column" gap="600">
    <TextContentHeading
      heading="Features"
      subheading="Everything you need to succeed"
    />
    <Text>
      Our platform provides <TextStrong>powerful tools</TextStrong> to help you{" "}
      <TextEmphasis>achieve your goals</TextEmphasis>.
    </Text>
  </Flex>
</Section>
```

### Card with Mixed Text

```tsx
<Card variant="stroke" padding="800">
  <Flex direction="column" gap="400">
    <TextHeading>Product Name</TextHeading>
    <Text lineClamp={3}>{productDescription}</Text>
    <TextPrice currency="$" price="99" label="/ month" size="small" />
  </Flex>
</Card>
```

### Footer Navigation

```tsx
<footer>
  <Flex direction="row" gap="1200">
    <TextLinkList title="Company">
      <TextListItem>
        <TextLink href="/about">About</TextLink>
      </TextListItem>
      <TextListItem>
        <TextLink href="/careers">Careers</TextLink>
      </TextListItem>
    </TextLinkList>

    <TextLinkList title="Support">
      <TextListItem>
        <TextLink href="/help">Help Center</TextLink>
      </TextListItem>
      <TextListItem>
        <TextLink href="/contact">Contact</TextLink>
      </TextListItem>
    </TextLinkList>
  </Flex>
</footer>
```

### Feature List

```tsx
<TextList title="Key Benefits" density="default">
  <TextListItem>
    <TextStrong>Fast Performance</TextStrong> - Optimized for speed
  </TextListItem>
  <TextListItem>
    <TextStrong>Secure</TextStrong> - Enterprise-grade security
  </TextListItem>
  <TextListItem>
    <TextStrong>Scalable</TextStrong> - Grows with your needs
  </TextListItem>
</TextList>
```

## Responsive Behavior

### Automatic Responsive Typography

Some composite components automatically adjust:

```tsx
// Automatically uses smaller text on mobile
<TextContentTitle title="Responsive Title" subtitle="Adapts to screen size" />
```

- **Desktop:** `TextTitleHero` (72px)
- **Mobile:** `TextTitlePage` (48px)

### Manual Responsive Control

Use the `useMediaQuery` hook for custom responsive behavior:

```tsx
import { useMediaQuery } from "hooks";

function ResponsiveText() {
  const { isMobile } = useMediaQuery();

  return isMobile ? (
    <TextHeading>Mobile Heading</TextHeading>
  ) : (
    <TextTitlePage>Desktop Title</TextTitlePage>
  );
}
```

## Accessibility

### Semantic HTML

All text components render semantic HTML:

- `<h1>` to `<h6>` for headings
- `<p>` for paragraphs
- `<strong>` for emphasis
- `<em>` for italic emphasis
- Proper list structure with `<ul>` and `<li>`

### Focus Management

`TextLink` includes built-in focus ring styles:

```css
.text-body-link:focus-visible {
  outline: none;
  box-shadow: 0 0 0 var(--global-focus-ring-size)
    var(--global-focus-ring-color);
}
```

### Screen Readers

- Semantic HTML ensures screen reader compatibility
- Use appropriate element types for context
- Ensure heading hierarchy is logical (h1 → h2 → h3)

## Migration from Raw HTML

### Before (Raw HTML)

```tsx
<div>
  <h1 style={{ fontSize: "72px", fontWeight: "bold" }}>Title</h1>
  <p style={{ fontSize: "16px", color: "#333" }}>
    Some text with <strong>bold</strong> and <em>italic</em>
  </p>
</div>
```

### After (SDS Components)

```tsx
<Flex direction="column" gap="400">
  <TextTitleHero>Title</TextTitleHero>
  <Text>
    Some text with <TextStrong>bold</TextStrong> and{" "}
    <TextEmphasis>italic</TextEmphasis>
  </Text>
</Flex>
```

**Benefits:**

- Uses design tokens (automatically themed)
- Consistent typography scale
- Semantic HTML
- Accessible by default
- Responsive out of the box

## Summary

The SDS Text component system provides:

1. **Semantic HTML** - Proper element types for accessibility
2. **Design Tokens** - CSS variables for consistent theming
3. **Flexible Styling** - Inline overrides or consistent styles
4. **Responsive** - Automatic mobile adjustments
5. **Truncation** - Built-in ellipsis support
6. **Composition** - Composite components for common patterns
7. **Type Safety** - Full TypeScript support

Always prefer using the appropriate text component over raw HTML or custom styling to maintain design system consistency and accessibility.
