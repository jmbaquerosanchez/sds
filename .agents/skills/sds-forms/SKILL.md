# SDS Forms

This skill explains the rules and best practices for creating forms in the Simple Design System (SDS).

## Overview

Forms in SDS are composed of several primitives and compositions that work together to create accessible, consistent form experiences. The system supports two main form types: **contained forms** (with background and border) and **inline forms** (single-line, minimal styling).

## Component Locations

```typescript
// Form structure and layout
import { Form, Fieldset, Legend, FieldGroup } from "primitives";

// Form field components
import {
  InputField,
  TextareaField,
  SelectField,
  CheckboxField,
  RadioField,
  SliderField,
  SearchField,
} from "primitives";

// Form composition wrapper
import { FormBox } from "compositions";

// Actions
import { Button, ButtonDanger, ButtonGroup } from "primitives";

// Actual paths:
// src/ds/ui/primitives/Fieldset/Fieldset.tsx
// src/ds/ui/primitives/Input/Input.tsx
// src/ds/ui/primitives/Textarea/Textarea.tsx
// src/ds/ui/primitives/Select/Select.tsx
// src/ds/ui/primitives/Checkbox/Checkbox.tsx
// src/ds/ui/primitives/Button/Button.tsx
// src/ds/ui/compositions/Forms/Forms.tsx
```

## Key Principles from Figma

Based on the Figma design system:

### 1. Form Types

**Contained Forms (Default)**

- Have a background (`var(--sds-color-background-default-default)`)
- Have a border (`1px solid var(--sds-color-border-default-default)`)
- Have padding (`var(--sds-size-space-600)` = 24px)
- Have rounded corners (`var(--sds-size-radius-200)` = 8px)
- Use vertical layout with gap (`var(--sds-size-space-600)` = 24px)
- **All contained forms should match the style of filled cards**

**Inline Forms**

- No outer spacing, fill area, or border
- Contain only one input field and one button
- Horizontally arranged with gap (`var(--sds-size-space-300)` = 12px)
- Input field takes flexible width (`flex: 1`)
- Button has fixed width based on content
- **Rely on context for visual styling**

### 2. Fieldset Structure

Fieldsets wrap form components and provide semantic grouping:

```
Fieldset (wrapper with border and padding)
├── Legend (optional heading with description)
├── Field inputs (vertically stacked)
├── Checkbox/Radio groups (optional)
└── Button Group (actions)
```

**Layout Rules:**

- Vertical arrangement by default
- Gap between elements: `var(--sds-size-space-600)` (24px)
- Column layouts created with additional wrapper frames
- All fields stretch to full width of container

### 3. Form Field Anatomy

Every form field follows this structure:

```
Field Container
├── Label (optional - hasLabel prop)
├── Description (optional - hasDescription prop)
├── Input/Control (required)
└── Error Message (optional - hasError prop)
```

**Spacing:**

- Gap between elements: `var(--sds-size-space-200)` (8px)
- Fields stack vertically with full width

## Form Component

### Basic Form

```tsx
import { Form } from "primitives";

<Form onSubmit={(e) => handleSubmit(e)}>{/* Form fields */}</Form>;
```

### FormBox (Contained Form)

Use `FormBox` for contained forms with background and border:

```tsx
import { FormBox } from "compositions";
import { InputField, CheckboxField, ButtonGroup, Button } from "primitives";

<FormBox onSubmit={handleSubmit}>
  <InputField label="Full Name" placeholder="John Doe" />
  <InputField label="Email" type="email" placeholder="you@example.com" />
  <CheckboxField label="I accept the terms" description="Read our T&Cs" />
  <ButtonGroup align="justify">
    <Button variant="primary" type="submit">
      Submit
    </Button>
  </ButtonGroup>
</FormBox>;
```

**Key Points:**

- `FormBox` automatically applies contained form styling
- Children are vertically stacked with proper spacing
- Background, border, padding, and radius are handled automatically

### Inline Form (Single-Line)

For newsletter signups, search bars, etc.:

```tsx
import { Form } from "primitives";
import { InputField, Button } from "primitives";

<Form singleLine onSubmit={handleSubmit}>
  <InputField hasLabel={false} placeholder="you@example.com" />
  <Button variant="primary" type="submit">
    Submit
  </Button>
</Form>;
```

**Key Points:**

- Use `singleLine` prop for horizontal layout
- Set `hasLabel={false}` on the input field
- Only one input and one button allowed
- No FormBox wrapper needed
- Minimal styling - relies on context

## Form Field Components

### InputField

```tsx
import { InputField } from "primitives";

// Basic usage
<InputField
  label="Email"
  placeholder="you@example.com"
/>

// With description
<InputField
  label="Password"
  description="Must be at least 8 characters"
  type="password"
/>

// With validation error
<InputField
  label="Username"
  errorMessage="Username is already taken"
  isInvalid
/>

// Without label (inline forms)
<InputField
  hasLabel={false}
  placeholder="Search..."
/>
```

**Props:**

- `label?: string` - Field label text
- `description?: string` - Helper text below input
- `errorMessage?: string | ((validation) => string)` - Error message
- `placeholder?: string` - Input placeholder
- All standard HTML input attributes (type, required, disabled, etc.)
- React Aria TextField props (isInvalid, isRequired, etc.)

### TextareaField

```tsx
import { TextareaField } from "primitives";

<TextareaField
  label="Delivery note"
  placeholder="Enter delivery instructions..."
  rows={4}
/>

// Non-resizable
<TextareaField
  label="Comments"
  isResizable={false}
/>
```

**Props:**

- `label?: string` - Field label
- `description?: string` - Helper text
- `errorMessage?: string` - Error message
- `placeholder?: string` - Placeholder text
- `isResizable?: boolean` - Allow vertical resize (default: true)
- All standard HTML textarea attributes

**Styling:**

- Minimum height: 80px
- Padding: `var(--sds-size-space-400)` horizontal, `var(--sds-size-space-300)` vertical
- Drag handle appears at bottom-right when resizable

### SelectField

```tsx
import { SelectField, SelectItem } from "primitives";

<SelectField label="Location">
  <SelectItem>United States</SelectItem>
  <SelectItem>Canada</SelectItem>
  <SelectItem>Mexico</SelectItem>
  <SelectItem>United Kingdom</SelectItem>
</SelectField>

// With data-driven items
<SelectField
  label="Country"
  items={countries}
  placeholder="Select a country"
>
  {(item) => <SelectItem id={item.id}>{item.name}</SelectItem>}
</SelectField>
```

**Props:**

- `label?: string` - Field label
- `description?: string` - Helper text
- `errorMessage?: string` - Error message
- `items?: Iterable<T>` - Data items for rendering
- `children` - SelectItem components or render function
- React Aria Select props

**Dropdown Styling:**

- Appears with shadow: `var(--sds-effects-shadows-drop-shadow-200)`
- Selected item shown with checkmark icon
- Bold font weight for selected item

### CheckboxField

```tsx
import { CheckboxField } from "primitives";

// Basic checkbox
<CheckboxField label="I accept the terms" />

// With description
<CheckboxField
  label="Subscribe to newsletter"
  description="Get weekly updates about new products"
/>

// With error
<CheckboxField
  label="Agree to terms"
  errorMessage="You must accept the terms to continue"
  isInvalid
/>

// Controlled
<CheckboxField
  label="Remember me"
  isSelected={isChecked}
  onChange={setIsChecked}
/>
```

**Props:**

- `label?: string` - Checkbox label
- `description?: string` - Helper text (appears below label)
- `errorMessage?: string` - Error message
- `isSelected?: boolean` - Controlled selection state
- `onChange?: (isSelected: boolean) => void` - Change handler
- All React Aria Checkbox props (isDisabled, isReadOnly, etc.)

**Layout:**

- Checkbox and label on same row with 12px gap
- Description appears below label, aligned with checkbox using spacer
- Checkbox icon changes based on state (check, minus for indeterminate)

### CheckboxGroup

For multiple related checkboxes:

```tsx
import { CheckboxGroup, CheckboxField } from "primitives";

<CheckboxGroup label="Interests" description="Select all that apply">
  <CheckboxField label="Design" />
  <CheckboxField label="Development" />
  <CheckboxField label="Marketing" />
</CheckboxGroup>;
```

## Fieldset and Legend

Use `Fieldset` and `Legend` for semantic grouping:

```tsx
import { Fieldset, Legend } from "primitives";

<Fieldset>
  <Legend>
    <h2>Shipping information</h2>
    <p>We ship within 2 working days</p>
  </Legend>

  <InputField label="Full Name" />
  <SelectField label="Location">{/* options */}</SelectField>
  <TextareaField label="Delivery note" />
</Fieldset>;
```

**Legend Structure:**

- Heading uses typography: `var(--sds-typography-heading-size-base)` (24px)
- Font weight: `var(--sds-typography-heading-font-weight)` (600)
- Description text uses body typography
- Gap between heading and description: `var(--sds-size-space-100)` (4px)

## Button Groups

Position and align form action buttons:

```tsx
import { ButtonGroup, Button, ButtonDanger } from "primitives";

// Single button - full width
<ButtonGroup align="justify">
  <Button variant="primary" type="submit">
    Submit
  </Button>
</ButtonGroup>

// Multiple buttons - start aligned
<ButtonGroup align="start">
  <Button variant="primary" type="submit">
    Save
  </Button>
  <Button variant="subtle">
    Cancel
  </Button>
</ButtonGroup>

// Multiple buttons - end aligned
<ButtonGroup align="end">
  <Button variant="subtle">
    Back
  </Button>
  <Button variant="primary" type="submit">
    Next
  </Button>
</ButtonGroup>

// Destructive action
<ButtonGroup align="justify">
  <ButtonDanger variant="danger-primary" type="submit">
    Delete Account
  </ButtonDanger>
</ButtonGroup>

// Stacked buttons (mobile-friendly)
<ButtonGroup align="stack">
  <Button variant="primary">Primary Action</Button>
  <Button variant="subtle">Secondary Action</Button>
</ButtonGroup>
```

**Alignment Options:**

- `start` - Left-aligned with gap between buttons
- `end` - Right-aligned with gap between buttons
- `center` - Center-aligned with gap between buttons
- `justify` - Full-width buttons (each button stretches)
- `stack` - Vertically stacked, full-width buttons

**Gap:** `var(--sds-size-space-400)` (16px) between buttons

## Form Validation

SDS uses React Aria's built-in validation:

```tsx
import { Form } from "primitives";
import { InputField, ButtonGroup, Button } from "primitives";

<Form validationBehavior="native" onSubmit={handleSubmit}>
  <InputField
    label="Email"
    type="email"
    isRequired
    errorMessage="Please enter a valid email"
  />

  <InputField
    label="Password"
    type="password"
    isRequired
    minLength={8}
    errorMessage={(validation) =>
      validation.validationDetails.tooShort
        ? "Password must be at least 8 characters"
        : "Please enter your password"
    }
  />

  <ButtonGroup align="justify">
    <Button type="submit">Submit</Button>
  </ButtonGroup>
</Form>;
```

**Validation Props:**

- `isRequired` - Field is required
- `isInvalid` - Manually set invalid state
- `validate` - Custom validation function
- `validationBehavior="native"` - Use browser validation
- `errorMessage` - Static string or function that receives validation details

## Responsive Behavior

Forms are responsive by default:

1. **Container Padding:**
   - Use `useMediaQuery()` hook to adjust FormBox padding
   - Desktop: `padding="600"` (24px)
   - Mobile: `padding="400"` (16px) or `padding="600"`

2. **Field Width:**
   - Fields automatically stretch to container width
   - Use layout components (Flex, Section) to control form width

3. **Button Groups:**
   - Use `align="stack"` on mobile for full-width stacked buttons
   - Desktop can use `align="start"`, `align="end"`, or `align="justify"`

```tsx
import { useMediaQuery } from "hooks";
import { FormBox } from "compositions";

function ResponsiveForm() {
  const { isMobile } = useMediaQuery();

  return (
    <FormBox onSubmit={handleSubmit}>
      {/* Fields */}
      <ButtonGroup align={isMobile ? "stack" : "end"}>
        <Button variant="subtle">Cancel</Button>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </ButtonGroup>
    </FormBox>
  );
}
```

## Common Form Patterns

### Registration Form

```tsx
<FormBox onSubmit={handleRegister}>
  <InputField label="Full Name" isRequired />
  <InputField label="Email" type="email" isRequired />
  <InputField label="Password" type="password" isRequired minLength={8} />
  <CheckboxField
    label="I accept the terms and conditions"
    description="Read our terms"
    isRequired
  />
  <ButtonGroup align="justify">
    <Button variant="primary" type="submit">
      Create Account
    </Button>
  </ButtonGroup>
</FormBox>
```

### Shipping Form

```tsx
<FormBox onSubmit={handleShipping}>
  <Legend>
    <h2>Shipping information</h2>
    <p>We ship within 2 working days</p>
  </Legend>

  <InputField label="Full Name" isRequired />

  <SelectField label="Country" isRequired>
    <SelectItem>United States</SelectItem>
    <SelectItem>Canada</SelectItem>
    <SelectItem>United Kingdom</SelectItem>
  </SelectField>

  <TextareaField
    label="Delivery note"
    placeholder="Any special instructions..."
  />

  <CheckboxField
    label="I accept the terms"
    description="Read our T&Cs"
    isRequired
  />

  <ButtonGroup align="justify">
    <Button variant="primary" type="submit">
      Continue to Payment
    </Button>
  </ButtonGroup>
</FormBox>
```

### Newsletter Form (Inline)

```tsx
<Form singleLine onSubmit={handleNewsletter}>
  <InputField
    hasLabel={false}
    aria-label="Email address"
    type="email"
    placeholder="you@example.com"
    isRequired
  />
  <Button variant="primary" type="submit">
    Subscribe
  </Button>
</Form>
```

### Contact Form

```tsx
<FormBox onSubmit={handleContact}>
  <InputField label="Name" isRequired />
  <InputField label="Email" type="email" isRequired />
  <InputField label="Subject" isRequired />
  <TextareaField
    label="Message"
    isRequired
    rows={6}
    placeholder="Tell us how we can help..."
  />
  <ButtonGroup align="end">
    <Button variant="subtle" onPress={handleCancel}>
      Cancel
    </Button>
    <Button variant="primary" type="submit">
      Send Message
    </Button>
  </ButtonGroup>
</FormBox>
```

## Best Practices

### DO ✅

1. **Use FormBox for contained forms** - Provides consistent styling
2. **Use single-line forms for simple inputs** - Newsletter signups, search bars
3. **Always provide labels** - Except for inline forms where you must use `aria-label`
4. **Use descriptions for helpful context** - Explain requirements or format
5. **Provide clear error messages** - Help users fix validation errors
6. **Use ButtonGroup for actions** - Ensures consistent spacing and alignment
7. **Group related fields in Fieldset** - Improves semantic structure
8. **Use appropriate field types** - InputField, SelectField, TextareaField, etc.
9. **Make required fields obvious** - Use `isRequired` prop
10. **Test with validation** - Ensure error states work correctly

### DON'T ❌

1. **Don't create custom field components** - Use existing SDS fields
2. **Don't hardcode spacing** - Use design tokens via CSS classes
3. **Don't skip labels** - Except inline forms (use `aria-label` instead)
4. **Don't use inline forms for complex inputs** - Only one input + one button
5. **Don't mix form styles** - Stick to contained OR inline, not both
6. **Don't add borders to inline forms** - They should be borderless
7. **Don't forget button groups** - Buttons should always be in ButtonGroup
8. **Don't use regular Button for destructive actions** - Use ButtonDanger
9. **Don't nest forms** - HTML doesn't allow nested `<form>` elements
10. **Don't skip validation** - Always validate user input

## Accessibility

SDS forms are accessible by default through React Aria:

1. **Labels** - Associated with inputs via `for`/`id` attributes
2. **Required fields** - Announced to screen readers
3. **Error messages** - Linked via `aria-describedby`
4. **Validation** - Live regions announce errors
5. **Keyboard navigation** - Full keyboard support
6. **Focus management** - Proper focus handling
7. **ARIA attributes** - Correct roles and properties

**Additional Considerations:**

- Use `aria-label` for inputs without visible labels (inline forms)
- Provide clear error messages that explain how to fix issues
- Don't rely solely on color to indicate errors
- Ensure sufficient color contrast for all states
- Test with keyboard navigation
- Test with screen readers

## Design Tokens Reference

Forms use the following design tokens:

**Spacing:**

- `--sds-size-space-100` (4px) - Small gap (legend heading to description)
- `--sds-size-space-200` (8px) - Field internal spacing (label to input to error)
- `--sds-size-space-300` (12px) - Inline form gap, checkbox gap
- `--sds-size-space-400` (16px) - Input padding horizontal, button group gap
- `--sds-size-space-600` (24px) - Fieldset padding, field vertical gap

**Colors:**

- `--sds-color-background-default-default` - Form/input background
- `--sds-color-border-default-default` - Form/input borders
- `--sds-color-text-default-default` - Primary text
- `--sds-color-text-default-secondary` - Description text
- `--sds-color-text-default-tertiary` - Placeholder text

**Borders:**

- `--sds-size-stroke-border` (1px) - Standard border width
- `--sds-size-radius-200` (8px) - Input and form border radius
- `--sds-size-radius-100` (4px) - Checkbox border radius

**Typography:**

- `--sds-typography-body-size-medium` (16px) - Input/label text
- `--sds-typography-heading-size-base` (24px) - Legend heading
- `--sds-typography-body-font-weight-regular` (400) - Normal text
- `--sds-typography-heading-font-weight` (600) - Heading weight

**Effects:**

- `--sds-effects-shadows-drop-shadow-200` - Select dropdown shadow

## Related Components

- [Button Component](../sds-button/) - Form action buttons
- [Card Component](../sds-card-component/) - For card-based forms
- [Section Layout](../sds-section-layout/) - Page-level form containers
- [Flex Layout](../sds-flexbox-layout/) - Form layout control

## Examples in Codebase

- **Stories:** `src/ds/stories/compositions/Forms.stories.tsx`
- **Form Components:** `src/ds/ui/compositions/Forms/`
- **Field Components:** `src/ds/ui/primitives/*/` (Input, Select, Checkbox, etc.)
- **Fieldset:** `src/ds/ui/primitives/Fieldset/Fieldset.tsx`

---

**Remember:** Forms in SDS follow the same design patterns as other components - use design tokens, leverage existing primitives, and maintain consistency with the overall system. When in doubt, reference the Figma designs and existing implementations.
