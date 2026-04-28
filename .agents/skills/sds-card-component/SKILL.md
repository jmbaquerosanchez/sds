# SDS Card Component

This skill explains the rules and best practices for using the `Card` component in the Simple Design System (SDS).

## Overview

The `Card` component is a versatile composition primitive used to create contained, visually distinct content blocks. Cards are the foundation for several specialized card types including pricing cards, product info cards, testimonial cards, and more.

## Component Location

```typescript
import {
  Card,
  PricingCard,
  ProductInfoCard,
  ReviewCard,
  StatsCard,
  TestimonialCard,
} from "compositions";
// Actual path: src/ds/ui/compositions/Cards/Cards.tsx
```

## Key Principles from Figma

Based on the Figma design system:

### 1. Width Behavior

- **Cards have a fixed width of 440px in the Figma component set**
- **In actual implementations, cards should use "fill" as their auto layout property**
- **Width and height should be defined by the parent container**
- Never set explicit width on cards; let the layout system control sizing

### 2. Content Structure

All cards follow a consistent internal structure:

1. **Asset/Icon** (optional) - Visual element at the start
2. **Body** - Main content area containing:
   - **Text section** - Heading and body text
   - **Button Group** (optional) - Action buttons

### 3. Layout Direction

Cards support two directions that adapt responsively:

```typescript
direction?: "horizontal" | "vertical"
```

- **Vertical** (default): Asset stacked above body content
- **Horizontal**: Asset beside body content
- **All cards become vertical on mobile automatically**

## Base Card Props

```typescript
export type CardProps = {
  /**
   * Alignment of card content
   */
  align?: "start" | "center" | "end";

  /**
   * Initial direction of the card
   * All cards become vertical on mobile
   */
  direction?: "horizontal" | "vertical";

  /**
   * Makes the entire card pressable
   */
  interactionProps?: AnchorOrButtonProps;

  /**
   * Asset for the card (Icon or Image)
   */
  asset?: React.ReactNode;

  /**
   * Internal padding (maps to design tokens)
   */
  padding?: "600" | "800";

  /**
   * Visual variant
   */
  variant?: "default" | "stroke" | "brand";
};
```

## Variants

### 1. `default`

```tsx
<Card variant="default">{/* Content */}</Card>
```

- Transparent background
- No borders or shadows
- Minimal visual treatment
- Use when cards don't need strong visual separation

### 2. `stroke`

```tsx
<Card variant="stroke">{/* Content */}</Card>
```

- White background (`var(--sds-color-background-default-default)`)
- Border: `var(--sds-color-border-default-default)`
- Drop shadow: `var(--sds-effects-shadows-drop-shadow-300)`
- Border radius: `var(--sds-size-radius-200)` (8px)
- **Most common variant for standalone cards**

### 3. `brand`

```tsx
<Card variant="brand">{/* Content */}</Card>
```

- Brand background: `var(--sds-color-background-brand-default)`
- Text color automatically adjusted to `var(--sds-color-text-brand-on-brand)`
- Use for featured or highlighted cards

## Padding Options

Padding maps directly to design token values:

- `padding="600"` → `var(--sds-size-space-600)` = 24px
- `padding="800"` → `var(--sds-size-space-800)` = 32px

**Default:** No padding (0). Padding should be explicitly set based on design needs.

## Specialized Card Components

### PricingCard

Used for displaying pricing tiers and plans.

```tsx
<PricingCard
  heading="Pro Plan"
  price="50"
  priceCurrency="$"
  priceLabel="/ mo"
  size="large" // or "small"
  variant="stroke"
  action="Upgrade"
  actionVariant="primary"
  onAction={() => {}}
  list={["Feature 1", "Feature 2", "Feature 3"]}
/>
```

**Key Features:**

- Displays heading, price, feature list, and action button
- Two sizes: `large` (column layout) or `small` (row layout for heading/price)
- Automatic padding based on size (800 for large, 600 for small)
- Always vertical direction
- Always stroke variant

**Figma Structure:**

```
├── Top
│   ├── Text Heading (title)
│   ├── Text Price (price with currency and label)
│   └── Text List (features)
└── Button (action)
```

### ProductInfoCard

Used for displaying product information with image.

```tsx
<ProductInfoCard
  asset={<Image src="/product.jpg" aspectRatio="4-3" />}
  heading="Product Name"
  price="99.99"
  description="Product description text"
  rating={4.5}
/>
```

**Key Features:**

- Fixed padding: 600
- Always vertical direction
- Always stroke variant
- Asset typically an Image component with 4:3 aspect ratio
- Displays heading, price with rating, and description

**Figma Structure:**

```
├── Image (product photo)
└── Body
    ├── Text (product name)
    ├── Text Strong (price and rating)
    └── Text Small (description)
```

### TestimonialCard

Used for displaying customer quotes and reviews.

```tsx
<TestimonialCard
  heading="Great product!"
  name="John Doe"
  username="johndoe"
  initials="JD"
  src="/avatar.jpg"
/>
```

**Key Features:**

- Fixed padding: 600
- Always vertical direction
- Always stroke variant
- Includes avatar with name and username
- Quote-style heading

**Figma Structure:**

```
├── Text Heading (quote)
└── Avatar Block
    ├── Avatar (profile image)
    ├── Name
    └── Username (@handle)
```

### ReviewCard

Used for displaying star ratings and reviews.

```tsx
<ReviewCard
  stars={5}
  title="Excellent Service"
  body="This product exceeded my expectations..."
  name="Jane Smith"
  date="Jan 15, 2024"
  src="/avatar.jpg"
/>
```

**Key Features:**

- Star rating display (1-5 stars)
- Review title and body
- Reviewer avatar and info
- Fixed padding: 600

### StatsCard

Used for displaying statistics or metrics.

```tsx
<StatsCard
  icon={<IconTrendingUp />}
  stat="10,000+"
  description="Active Users"
/>
```

**Key Features:**

- Center-aligned content
- Optional icon at top
- Large stat display
- Descriptive text below
- Fixed padding: 600

## Layout Integration

### Card Grids

Cards are typically used in grid layouts within Sections:

```tsx
<Section padding="1600">
  <Flex direction="column" gap="1200" container alignPrimary="center">
    <TextContentHeading>Features</TextContentHeading>

    {/* Three-column grid */}
    <Flex direction="row" gap="600" type="third">
      <Card variant="stroke" padding="600" direction="vertical">
        {/* Card content */}
      </Card>
      <Card variant="stroke" padding="600" direction="vertical">
        {/* Card content */}
      </Card>
      <Card variant="stroke" padding="600" direction="vertical">
        {/* Card content */}
      </Card>
    </Flex>
  </Flex>
</Section>
```

### Responsive Behavior

```tsx
import { useMediaQuery } from "hooks";

function ResponsiveCards() {
  const { isMobile } = useMediaQuery();

  return (
    <Section padding={isMobile ? "600" : "1600"}>
      <Flex
        direction={isMobile ? "column" : "row"}
        gap="600"
        type={isMobile ? undefined : "third"}
      >
        <Card variant="stroke" padding="600">
          {/* Content */}
        </Card>
        {/* More cards */}
      </Flex>
    </Section>
  );
}
```

## Interactive Cards

Cards can be made fully interactive using `interactionProps`:

```tsx
<Card
  variant="stroke"
  padding="600"
  interactionProps={{
    onPress: () => navigate("/details"),
    href: "/details", // For anchor behavior
  }}
>
  {/* Card content */}
</Card>
```

**Important:**

- The entire card becomes a pressable area
- Focus rings automatically appear on keyboard navigation
- Hover states are automatically applied
- Use `AnchorOrButtonProps` for proper a11y

## Design Token Reference

### Colors

**Backgrounds:**

- Default: `var(--sds-color-background-default-default)` - White/Dark
- Brand: `var(--sds-color-background-brand-default)` - Brand color
- On Brand Text: `var(--sds-color-text-brand-on-brand)` - Contrasting text

**Borders:**

- Default: `var(--sds-color-border-default-default)` - Light gray border
- Brand: `var(--sds-color-border-brand-default)` - Brand border

**Text:**

- Heading: `var(--sds-color-text-default-default)` - Primary text
- Body: `var(--sds-color-text-default-secondary)` - Secondary text
- On Brand: `var(--sds-color-text-brand-on-brand)` - Text on brand backgrounds

### Spacing

**Padding:**

- `var(--sds-size-space-600)` = 24px
- `var(--sds-size-space-800)` = 32px

**Gaps:**

- Content gap: `var(--sds-size-space-600)` = 24px (internal card spacing)
- Grid gap: `var(--sds-size-space-600)` = 24px (between cards)
- Text gap: `var(--sds-size-space-200)` = 8px (heading to body)

**Border Radius:**

- `var(--sds-size-radius-200)` = 8px

### Typography

**Heading:**

- Font family: `var(--sds-typography-heading-font-family)`
- Font size: `var(--sds-typography-heading-size-base)` = 24px
- Font weight: `var(--sds-typography-heading-font-weight)` = 600
- Line height: 1.2
- Letter spacing: -2%

**Body:**

- Font family: `var(--sds-typography-body-font-family)`
- Font size: `var(--sds-typography-body-size-medium)` = 16px
- Font weight: `var(--sds-typography-body-font-weight-regular)` = 400
- Line height: 1.4

### Shadows

- Drop shadow: `var(--sds-effects-shadows-drop-shadow-300)`

## Best Practices

### DO ✅

1. **Use specialized card components when available**

   ```tsx
   // Good
   <PricingCard {...props} />

   // Avoid
   <Card>
     <TextHeading>...</TextHeading>
     <TextPrice>...</TextPrice>
     {/* Manual pricing layout */}
   </Card>
   ```

2. **Let parent containers control width**

   ```tsx
   // Good
   <Flex direction="row" gap="600" type="third">
     <Card variant="stroke" padding="600">
       ...
     </Card>
   </Flex>
   ```

3. **Use consistent padding across similar cards**

   ```tsx
   // Good - all cards have padding="600"
   {
     cards.map((card) => (
       <Card key={card.id} variant="stroke" padding="600">
         {card.content}
       </Card>
     ));
   }
   ```

4. **Always use design tokens, never hardcoded values**

   ```tsx
   // Good
   <Card variant="stroke" padding="600">

   // Bad
   <div style={{ padding: "24px", border: "1px solid #d9d9d9" }}>
   ```

5. **Use appropriate variants for context**
   - `stroke` for standalone cards in grids
   - `brand` for featured/highlighted content
   - `default` when minimal visual treatment is needed

### DON'T ❌

1. **Don't set explicit widths on cards**

   ```tsx
   // Bad
   <Card style={{ width: "440px" }}>
   ```

2. **Don't create custom card layouts when specialized components exist**

   ```tsx
   // Bad - PricingCard exists for this
   <Card>
     <div className="custom-pricing-layout">...</div>
   </Card>
   ```

3. **Don't mix custom CSS with Card components**

   ```tsx
   // Bad
   <Card className="my-custom-card-styles">
   ```

4. **Don't hardcode colors or spacing**

   ```tsx
   // Bad
   <Card>
     <div style={{ color: "#1e1e1e", marginBottom: "24px" }}>
   ```

5. **Don't ignore responsive behavior**

   ```tsx
   // Bad - forcing horizontal on mobile
   <Card direction="horizontal"> {/* No responsive check */}

   // Good
   const { isMobile } = useMediaQuery();
   <Card direction={isMobile ? "vertical" : "horizontal"}>
   ```

## Common Patterns

### Pattern 1: Feature Grid

```tsx
<Section padding="1600">
  <Flex direction="column" gap="1200" container alignPrimary="center">
    <TextContentHeading>Features</TextContentHeading>
    <Flex direction="row" gap="600" type="third">
      {features.map((feature) => (
        <Card key={feature.id} variant="stroke" padding="600" align="center">
          <Icon name={feature.icon} />
          <Flex direction="column" gap="200">
            <TextHeading>{feature.title}</TextHeading>
            <Text>{feature.description}</Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  </Flex>
</Section>
```

### Pattern 2: Pricing Comparison

```tsx
<Section padding="1600">
  <Flex direction="column" gap="1200" container alignPrimary="center">
    <TextContentHeading>Choose Your Plan</TextContentHeading>
    <Flex direction="row" gap="600" type="third">
      {plans.map((plan) => (
        <PricingCard
          key={plan.sku}
          heading={plan.name}
          price={plan.price}
          priceCurrency="$"
          priceLabel="/ mo"
          list={plan.features}
          action={plan.isCurrentPlan ? "Current Plan" : "Upgrade"}
          actionDisabled={plan.isCurrentPlan}
          actionVariant="primary"
          onAction={() => handleSelectPlan(plan.sku)}
        />
      ))}
    </Flex>
  </Flex>
</Section>
```

### Pattern 3: Product Grid

```tsx
<Section padding="1600">
  <Flex direction="column" gap="1200">
    <TextContentHeading>Our Products</TextContentHeading>
    <Flex direction="row" gap="600" type="fourth">
      {products.map((product) => (
        <ProductInfoCard
          key={product.id}
          asset={
            <Image
              src={product.imageUrl}
              alt={product.name}
              aspectRatio="4-3"
            />
          }
          heading={product.name}
          price={product.price}
          description={product.description}
          rating={product.rating}
        />
      ))}
    </Flex>
  </Flex>
</Section>
```

### Pattern 4: Testimonials

```tsx
<Section padding="1600" variant="neutral">
  <Flex direction="column" gap="1200" container alignPrimary="center">
    <TextContentHeading>What Our Customers Say</TextContentHeading>
    <Flex direction="row" gap="600" type="third">
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          heading={testimonial.quote}
          name={testimonial.author}
          username={testimonial.handle}
          src={testimonial.avatarUrl}
          initials={testimonial.initials}
        />
      ))}
    </Flex>
  </Flex>
</Section>
```

## Figma Implementation Notes

When implementing designs from Figma:

1. **Look for the Card component** in the design file (fixed 440px width)
2. **Check the variant properties:**
   - Icon position (horizontal vs vertical layout)
   - Padding (24px = 600, 32px = 800)
   - Border presence (stroke variant)
   - Background color (default, brand)
3. **Map Figma layers to SDS components:**
   - "Block" layers → Asset prop or Icon components
   - "Text Heading" → TextHeading component
   - "Text" body → Text component
   - "Button Group" → ButtonGroup with Button components
4. **Extract design tokens from Figma variables:**
   - All spacing uses `var(--sds-size-space-*)` tokens
   - All colors use `var(--sds-color-*)` tokens
   - All typography uses `var(--sds-typography-*)` tokens
5. **Respect responsive behavior:**
   - Cards become vertical on mobile automatically
   - Padding may reduce on mobile (use `useMediaQuery` hook)
   - Grid columns collapse to single column on mobile

## Accessibility Considerations

1. **Semantic HTML:** Cards use `<div>` by default but can be composed with semantic children
2. **Interactive cards:** When using `interactionProps`, proper ARIA labels are applied
3. **Focus management:** Focus rings automatically appear on keyboard navigation
4. **Text contrast:** All text meets WCAG AA standards against backgrounds
5. **Touch targets:** Interactive cards have sufficient touch target size (minimum 44×44px)

## Related Components

- **Flex** - For card grid layouts
- **Section** - For containing card grids in page sections
- **Button/ButtonGroup** - For card actions
- **Image** - For card assets
- **Icon** - For card icons
- **Text primitives** - TextHeading, Text, TextSmall, etc.
- **Avatar/AvatarBlock** - For testimonial and review cards

## Keywords

cards, tile, tiles, pricing, product, testimonial, review, stats, composition, container, content block
