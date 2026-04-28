# SDS Image Component

## Purpose

Guide AI agents in correctly implementing Image components from Figma designs using the SDS component library. Images are not created as components in Figma, but exist as components in code.

## When to Use This Skill

- Implementing image displays from Figma designs
- Creating responsive images with specific aspect ratios
- Building product images, hero images, or content images
- Ensuring proper image sizing and scaling behavior

## Component Location

```typescript
import { Image } from "primitives";
// Actual path: src/ds/ui/primitives/Image/Image.tsx
```

## Key Principles from Figma

Based on the Figma design system:

### 1. Not a Figma Component

- **Images are not created as components in Figma**
- They exist as components in code for consistent behavior
- When you see images in Figma designs, you need to translate them to the Image component

### 2. Size Behavior

- **Size is applied to the max height**
- **Images scale to that height at the provided aspect ratio**
- Width is determined by the aspect ratio and height constraint

### 3. Aspect Ratio System

- **Aspect ratios fix the image sizes regardless of its natural dimensions**
- Images use **object-fit: cover** and are **positioned in the center**
- This ensures consistent sizing across different source images

## Component Props

```typescript
export type ImageProps = Omit<ComponentPropsWithoutRef<"img">, "alt"> & {
  /**
   * Required alt text for accessibility
   */
  alt: string;

  /**
   * Aspect ratio of the image
   * - "1-1": Square (1:1)
   * - "16-9": Widescreen (16:9)
   * - "4-3": Standard (4:3)
   * - "fill": Preserves aspect ratio while scaling 100% horizontally
   * - "natural": Does not attempt to scale; max-width of 100%
   * @default "natural"
   */
  aspectRatio?: "1-1" | "16-9" | "4-3" | "fill" | "natural";

  /**
   * Maximum height constraint
   * - "small": 10rem (160px)
   * - "medium": 20rem (320px)
   * - "large": 30rem (480px)
   * - "fill": Auto height, 100% width
   * - "natural": Auto height (unconstrained)
   * @default "natural"
   */
  size?: "small" | "medium" | "large" | "fill" | "natural";

  /**
   * Visual style variant
   * - "default": No border radius
   * - "rounded": Uses var(--sds-size-radius-100) for subtle rounding
   * @default "rounded"
   */
  variant?: "default" | "rounded";
};
```

## Aspect Ratio Options

### 1. `1-1` (Square)

```tsx
<Image
  src="/path/to/image.jpg"
  alt="Product image"
  aspectRatio="1-1"
  size="medium"
/>
```

- Perfect square format
- Ideal for: Product thumbnails, profile images, grid layouts

### 2. `16-9` (Widescreen)

```tsx
<Image
  src="/path/to/image.jpg"
  alt="Hero image"
  aspectRatio="16-9"
  size="large"
/>
```

- Standard widescreen format
- Ideal for: Hero images, video thumbnails, banners

### 3. `4-3` (Standard)

```tsx
<Image
  src="/path/to/image.jpg"
  alt="Content image"
  aspectRatio="4-3"
  size="medium"
/>
```

- Classic photo format
- Ideal for: Gallery images, content photos

### 4. `fill`

```tsx
<Image
  src="/path/to/image.jpg"
  alt="Background image"
  aspectRatio="fill"
  size="fill"
/>
```

- **"Fill" preserves the aspect ratio while scaling 100% horizontally**
- Takes full width of parent container
- Height adjusts to maintain aspect ratio
- Ideal for: Background images, full-width banners

### 5. `natural`

```tsx
<Image
  src="/path/to/image.jpg"
  alt="Natural sized image"
  aspectRatio="natural"
  size="natural"
/>
```

- **"Natural" size does not attempt to scale the image**
- Has a **max-width of 100%** to prevent overflow
- Displays image at its intrinsic dimensions (within container bounds)
- Ideal for: Logos, icons, illustrations where original proportions matter

## Size Options

The `size` prop controls the maximum height constraint:

| Size      | Height        | Use Case                                         |
| --------- | ------------- | ------------------------------------------------ |
| `small`   | 10rem (160px) | Thumbnails, small cards                          |
| `medium`  | 20rem (320px) | Standard content images                          |
| `large`   | 30rem (480px) | Hero images, featured content                    |
| `fill`    | Auto          | Full container fill (with `aspectRatio="fill"`)  |
| `natural` | Auto          | Unconstrained height (respects image dimensions) |

## Loading States

The Image component includes built-in loading states:

- **Placeholder**: Gray background displays while image loads
- **Loading class**: Image hidden until fully loaded
- **Smooth transition**: Automatic switch from placeholder to loaded image

This is handled automatically—no additional code needed.

## Variant Options

### `default`

```tsx
<Image src="/path/to/image.jpg" alt="Image" variant="default" />
```

- No border radius
- Sharp corners

### `rounded` (Default)

```tsx
<Image src="/path/to/image.jpg" alt="Image" variant="rounded" />
```

- Uses `var(--sds-size-radius-100)` (4px)
- Subtle corner rounding
- Recommended for most use cases

## Picture Element Support

For responsive images with multiple sources:

```tsx
import { Picture, PictureSource, Image } from "primitives";

<Picture>
  <PictureSource srcSet="/images/hero-large.jpg" media="(min-width: 1024px)" />
  <PictureSource srcSet="/images/hero-medium.jpg" media="(min-width: 600px)" />
  <Image
    src="/images/hero-small.jpg"
    alt="Hero image"
    aspectRatio="16-9"
    size="large"
  />
</Picture>;
```

## Common Patterns

### Product Grid

```tsx
<Flex direction="row" gap="400" type="third" wrap>
  {products.map((product) => (
    <div key={product.id}>
      <Image
        src={product.image}
        alt={product.name}
        aspectRatio="1-1"
        size="medium"
        variant="rounded"
      />
    </div>
  ))}
</Flex>
```

### Hero Image

```tsx
<Section>
  <Image
    src="/hero.jpg"
    alt="Welcome to our platform"
    aspectRatio="16-9"
    size="large"
    variant="rounded"
  />
</Section>
```

### Content Image with Natural Sizing

```tsx
<div className="content-wrapper">
  <Image
    src="/diagram.png"
    alt="Architecture diagram"
    aspectRatio="natural"
    size="natural"
    variant="rounded"
  />
</div>
```

## CSS Custom Properties

The Image component uses CSS custom properties for sizing:

```css
/* From src/ds/ui/primitives/Image/image.css */

.image-size-small {
  --image-size-height: 10rem;
  height: var(--image-size-height);
}

.image-size-medium {
  --image-size-height: 20rem;
  height: var(--image-size-height);
}

.image-size-large {
  --image-size-height: 30rem;
  height: var(--image-size-height);
}
```

## Common Pitfalls

- ❌ **Don't forget alt text** - The `alt` prop is required for accessibility
- ❌ **Don't hardcode width/height** - Use `size` and `aspectRatio` props instead
- ❌ **Don't use `aspectRatio` with `natural` size** - Natural sizing ignores aspect ratio constraints
- ❌ **Don't mix `fill` size with other aspect ratios** - Use `fill` for both when you want full container coverage
- ❌ **Don't use raw `<img>` tags** - Always use the `Image` component for consistency and loading states

## Translation from Figma

When implementing images from Figma designs:

1. **Identify image dimensions in Figma** - Note the width and height
2. **Determine aspect ratio** - Calculate or match to standard ratios (1:1, 16:9, 4:3)
3. **Choose appropriate size** - Based on the design's height (small/medium/large)
4. **Apply variant** - Use `rounded` unless design shows sharp corners
5. **Add alt text** - Write descriptive text for accessibility

Example Figma → Code:

- Figma: 320x320px image → `aspectRatio="1-1" size="medium"`
- Figma: 640x360px image → `aspectRatio="16-9" size="large"`
- Figma: Full-width hero → `aspectRatio="fill" size="fill"`

## Accessibility

- **Always provide meaningful alt text** - Describe what the image shows or its purpose
- **Use empty alt (`alt=""`) only for decorative images** - Screen readers will skip them
- **Loading states are automatic** - Placeholders ensure layout stability during load

## Related Components

- **Section** - Page-level structure for images
- **Flex** - Grid layouts for multiple images
- **Card** - Container for images with content

## References

- Implementation: [src/ds/ui/primitives/Image/Image.tsx](src/ds/ui/primitives/Image/Image.tsx)
- Styles: [src/ds/ui/primitives/Image/image.css](src/ds/ui/primitives/Image/image.css)
- Figma: Simple Design System (Images are representation-only, not components)
