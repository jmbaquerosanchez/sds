# SDS Menu Component

This skill explains the rules and best practices for using the `Menu` component in the Simple Design System (SDS).

## Overview

The `Menu` component is a comprehensive primitive for creating dropdown menus, context menus, and action menus. It's built on React Aria Components to provide full keyboard navigation, screen reader support, and ARIA compliance. Menus are used for displaying lists of actions or options that appear in a popover overlay.

## Component Location

```typescript
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuTrigger,
  MenuPopover,
  MenuHeader,
  MenuSection,
  MenuHeading,
  MenuSeparator,
  MenuLabel,
  MenuDescription,
  MenuShortcut,
} from "primitives";
// Actual path: src/ds/ui/primitives/Menu/Menu.tsx
```

## Key Principles from Figma

Based on the Figma design system:

### 1. Menu Structure

Menus follow a hierarchical structure:

```
Menu (container)
├── MenuHeader (optional) - Heading text for context
├── MenuSeparator (optional) - Visual divider
├── MenuSection - Grouping container
│   ├── MenuHeading (optional) - Section label
│   └── MenuItem (1 or more)
│       ├── Icon (optional) - Leading visual indicator
│       ├── MenuLabel - Primary text
│       ├── MenuDescription (optional) - Secondary descriptive text
│       └── MenuShortcut (optional) - Keyboard shortcut indicator
└── MenuSeparator (optional)
```

### 2. Visual Design

**Container:**

- Background: `var(--sds-color-background-default-default)` - White/Dark
- Border: `var(--sds-size-stroke-border)` with `var(--sds-color-border-default-default)`
- Border radius: `var(--sds-size-radius-200)` (8px)
- Shadow: `var(--sds-effects-shadows-drop-shadow-400)`
- Padding: `var(--sds-size-space-200)` (8px)

**Menu Item States:**

- **Default:** Transparent background with primary text color
- **Hover/Focus:** Brand background (`var(--sds-color-background-brand-default)`) with on-brand text color (`var(--sds-color-text-brand-on-brand)`)
- **Disabled:** Disabled text and icon colors

### 3. Composition Pattern

Menus are **composed components** - you build them from smaller primitives rather than using pre-configured templates. This provides maximum flexibility for different use cases.

## Core Components

### Menu

The main container component that holds all menu items.

```tsx
export type MenuProps<T> = RACMenuProps<T>;
<Menu>{/* MenuItem components */}</Menu>;
```

**Props:**

- Extends React Aria's `MenuProps`
- Generic type `T` for type-safe items with data collections
- Supports selection modes: `none`, `single`, `multiple`
- Handles keyboard navigation automatically

### MenuTrigger

Wrapper that connects a trigger button to the menu popover.

```tsx
<MenuTrigger>
  <Button>Options</Button>
  <MenuPopover>
    <Menu>{/* items */}</Menu>
  </MenuPopover>
</MenuTrigger>
```

**Features:**

- Manages open/closed state automatically
- Handles trigger interactions (click, keyboard)
- Positions popover relative to trigger
- Manages focus behavior

### MenuButton

Convenience component that combines MenuTrigger, trigger button, and menu in one.

```tsx
export interface MenuButtonProps<T>
  extends RACMenuProps<T>,
    Omit<RACMenuTriggerProps, "children"> {
  label: string;
  variant?: ButtonProps["variant"]; // "primary" | "neutral" | "subtle"
  placement?: MenuPopoverProps["placement"];
  icon?: React.ReactNode;
}

<MenuButton label="Options" variant="primary" placement="bottom start">
  <MenuItem>Action 1</MenuItem>
  <MenuItem>Action 2</MenuItem>
</MenuButton>;
```

**When to use:**

- Simple dropdown buttons with menu
- Icon buttons with menus (pass `icon` prop)
- Quick implementation without manual trigger setup

**Icon variant:**

```tsx
<MenuButton label="More options" icon={<IconMoreVertical />} variant="subtle">
  {/* items */}
</MenuButton>
```

### MenuPopover

The overlay container that displays the menu.

```tsx
<MenuPopover placement="bottom start">
  <Menu>{/* items */}</Menu>
</MenuPopover>
```

**Placement options:**

- `"bottom start"` - Below trigger, aligned to start edge (most common)
- `"bottom end"` - Below trigger, aligned to end edge
- `"top start"` - Above trigger
- `"right start"` - To the right
- And more positioning options from React Aria

### MenuItem

Individual selectable item within a menu.

```tsx
export type MenuItemProps = RACMenuItemProps;

<MenuItem
  onAction={() => handleAction()}
  textValue="Save" // Required for a11y if children aren't plain text
  isDisabled={false}
>
  <Icon name="save" />
  <MenuLabel>Save</MenuLabel>
  <MenuShortcut>⌘S</MenuShortcut>
</MenuItem>;
```

**Key Features:**

- Automatically handles hover/focus states
- Supports keyboard shortcuts display
- Can contain icons, labels, descriptions, and shortcuts
- Automatically adds chevron for submenus
- Grid-based layout (CSS Grid) for consistent alignment

**Internal Grid Structure:**

```
Grid columns: [icon] [label] [shortcut]
Grid rows: [label row] [description row (spans 2-3 columns)]
```

### MenuHeader

Optional header section at the top of a menu for context.

```tsx
<MenuHeader>
  <Text size="small" color="secondary">
    Heading
  </Text>
  <TextHeading size="small">Section Name</TextHeading>
</MenuHeader>
```

**Styling:**

- Padding: `var(--sds-size-space-200)` `var(--sds-size-space-400)` `var(--sds-size-space-100)`
- Contains small heading text (secondary color) and stronger heading text

### MenuSection

Groups related menu items together.

```tsx
<MenuSection>
  <MenuItem>Action 1</MenuItem>
  <MenuItem>Action 2</MenuItem>
</MenuSection>
```

**Note:** MenuSection is a wrapper `<div>` with `width: 100%`. For section headings, use `MenuHeading` as the first child.

### MenuHeading

Section heading label within a menu.

```tsx
<MenuSection>
  <MenuHeading>File Operations</MenuHeading>
  <MenuItem>New File</MenuItem>
  <MenuItem>Open File</MenuItem>
</MenuSection>
```

**Styling:**

- Color: `var(--sds-color-text-default-secondary)`
- Font: `var(--sds-font-body-strong)` (semi-bold)
- Padding: `var(--sds-size-space-200)` `var(--sds-size-space-400)` `var(--sds-size-space-100)`

### MenuSeparator

Visual divider between menu sections.

```tsx
<MenuItem>Action 1</MenuItem>
<MenuSeparator />
<MenuItem>Action 2</MenuItem>
```

**Styling:**

- Background: `var(--sds-color-border-default-default)`
- Height: `var(--sds-size-stroke-border)` (1px)
- Margin: `var(--sds-size-space-100)` `var(--sds-size-space-400)` (vertical horizontal)

### MenuLabel

Primary text label within a MenuItem.

```tsx
<MenuItem>
  <MenuLabel>Save Document</MenuLabel>
</MenuItem>
```

**Note:** MenuLabel extends the `Label` primitive from React Aria and applies menu-specific grid positioning.

### MenuDescription

Secondary descriptive text within a MenuItem.

```tsx
<MenuItem>
  <MenuLabel>Delete</MenuLabel>
  <MenuDescription>Permanently remove this item</MenuDescription>
</MenuItem>
```

**Styling:**

- Color: `var(--sds-color-text-default-secondary)` (secondary text)
- Font: `var(--sds-font-body-small)` (14px)
- Grid position: Spans across columns 1-3 (or 2-3 if icon present)

### MenuShortcut

Displays keyboard shortcut indicators.

```tsx
<MenuItem>
  <MenuLabel>Save</MenuLabel>
  <MenuShortcut>⌘S</MenuShortcut>
</MenuItem>
```

**Shortcut Characters:**

- `⌘` - Command (Mac)
- `⇧` - Shift
- `⌥` - Option (Alt)
- `⌃` - Control

**Styling:**

- Uses the `Keyboard` primitive component
- Color: `var(--menu-item-description-color)` (matches description)
- Font: `var(--sds-font-body-base)`
- Grid position: Column 3, aligned to end

## Component Patterns

### Pattern 1: Basic Dropdown Menu

```tsx
<MenuButton label="Actions" variant="primary">
  <MenuItem onAction={() => console.log("New")}>
    <IconPlus />
    <MenuLabel>New Item</MenuLabel>
    <MenuShortcut>⌘N</MenuShortcut>
  </MenuItem>
  <MenuItem onAction={() => console.log("Save")}>
    <IconSave />
    <MenuLabel>Save</MenuLabel>
    <MenuShortcut>⌘S</MenuShortcut>
  </MenuItem>
  <MenuSeparator />
  <MenuItem onAction={() => console.log("Delete")}>
    <IconTrash />
    <MenuLabel>Delete</MenuLabel>
  </MenuItem>
</MenuButton>
```

### Pattern 2: Menu with Sections

```tsx
<MenuButton label="Edit" variant="neutral">
  <MenuSection>
    <MenuHeading>Clipboard</MenuHeading>
    <MenuItem>
      <MenuLabel>Cut</MenuLabel>
      <MenuShortcut>⌘X</MenuShortcut>
    </MenuItem>
    <MenuItem>
      <MenuLabel>Copy</MenuLabel>
      <MenuShortcut>⌘C</MenuShortcut>
    </MenuItem>
    <MenuItem>
      <MenuLabel>Paste</MenuLabel>
      <MenuShortcut>⌘V</MenuShortcut>
    </MenuItem>
  </MenuSection>
  <MenuSeparator />
  <MenuSection>
    <MenuHeading>Format</MenuHeading>
    <MenuItem>
      <MenuLabel>Bold</MenuLabel>
      <MenuShortcut>⌘B</MenuShortcut>
    </MenuItem>
    <MenuItem>
      <MenuLabel>Italic</MenuLabel>
      <MenuShortcut>⌘I</MenuShortcut>
    </MenuItem>
  </MenuSection>
</MenuButton>
```

### Pattern 3: Menu with Header

```tsx
<MenuButton label="Options" variant="subtle">
  <MenuHeader>
    <Text size="small" color="secondary">
      Heading
    </Text>
    <TextHeading size="small">Workspace Actions</TextHeading>
  </MenuHeader>
  <MenuSeparator />
  <MenuItem>
    <IconSettings />
    <MenuLabel>Settings</MenuLabel>
  </MenuItem>
  <MenuItem>
    <IconHelp />
    <MenuLabel>Help & Support</MenuLabel>
  </MenuItem>
</MenuButton>
```

### Pattern 4: Context Menu with Manual Trigger

```tsx
<MenuTrigger>
  <IconButton variant="subtle" aria-label="More options">
    <IconMoreVertical />
  </IconButton>
  <MenuPopover placement="bottom end">
    <Menu>
      <MenuItem>
        <IconEdit />
        <MenuLabel>Edit</MenuLabel>
      </MenuItem>
      <MenuItem>
        <IconCopy />
        <MenuLabel>Duplicate</MenuLabel>
      </MenuItem>
      <MenuSeparator />
      <MenuItem>
        <IconTrash />
        <MenuLabel>Delete</MenuLabel>
        <MenuDescription>This action cannot be undone</MenuDescription>
      </MenuItem>
    </Menu>
  </MenuPopover>
</MenuTrigger>
```

### Pattern 5: Menu with Descriptions

```tsx
<MenuButton label="More Actions">
  <MenuItem>
    <IconShare />
    <MenuLabel>Share</MenuLabel>
    <MenuDescription>Send to other users</MenuDescription>
  </MenuItem>
  <MenuItem>
    <IconExport />
    <MenuLabel>Export</MenuLabel>
    <MenuDescription>Download as file</MenuDescription>
  </MenuItem>
  <MenuItem isDisabled>
    <IconLock />
    <MenuLabel>Archive</MenuLabel>
    <MenuDescription>Move to archive storage</MenuDescription>
  </MenuItem>
</MenuButton>
```

## Design Token Reference

### Colors

**Menu Container:**

- Background: `var(--sds-color-background-default-default)`
- Border: `var(--sds-color-border-default-default)`

**Menu Item (Default):**

- Background: `transparent`
- Text: `var(--sds-color-text-default-default)`
- Icon: `var(--sds-color-icon-default-default)`
- Description: `var(--sds-color-text-default-secondary)`

**Menu Item (Hover/Focus):**

- Background: `var(--sds-color-background-brand-default)`
- Text: `var(--sds-color-text-brand-on-brand)`
- Icon: `var(--sds-color-icon-brand-on-brand)`
- Description: `var(--sds-color-text-brand-on-brand)`

**Menu Item (Disabled):**

- Text: `var(--sds-color-text-disabled-default)`
- Icon: `var(--sds-color-icon-disabled-default)`
- Description: `var(--sds-color-text-disabled-default)`

**Separator:**

- Color: `var(--sds-color-border-default-default)`

### Spacing

**Menu Container:**

- Padding: `var(--sds-size-space-200)` = 8px
- Border radius: `var(--sds-size-radius-200)` = 8px

**Menu Item:**

- Padding: `var(--sds-size-space-300)` `var(--sds-size-space-400)` = 12px 16px
- Column gap: `var(--sds-size-space-400)` = 16px (between icon, label, shortcut)
- Row gap: `var(--sds-size-space-100)` = 4px (between label and description)
- Border radius: `var(--sds-size-radius-200)` = 8px

**Menu Header:**

- Padding: `var(--sds-size-space-200)` `var(--sds-size-space-400)` `var(--sds-size-space-100)` = 8px 16px 4px

**Menu Heading:**

- Padding: `var(--sds-size-space-200)` `var(--sds-size-space-400)` `var(--sds-size-space-100)` = 8px 16px 4px

**Menu Separator:**

- Margin: `var(--sds-size-space-100)` `var(--sds-size-space-400)` = 4px 16px
- Height: `var(--sds-size-stroke-border)` = 1px

**Popover Positioning:**

- Anchor gap: `var(--sds-size-space-300)` = 12px
- Anchor offset: `var(--sds-size-space-300)` = 12px

### Typography

**Menu Label:**

- Font: `var(--sds-font-body-base)` = 16px regular
- Line height: 1.4

**Menu Description:**

- Font: `var(--sds-font-body-small)` = 14px regular
- Line height: 1.4
- Color: Secondary text

**Menu Heading:**

- Font: `var(--sds-font-body-strong)` = 16px semi-bold
- Color: Secondary text

**Menu Shortcut:**

- Font: `var(--sds-font-body-base)` = 16px regular
- Color: Secondary text

### Shadows

- Drop shadow: `var(--sds-effects-shadows-drop-shadow-400)`

## Usage Guidelines

### DO ✅

1. **Use MenuButton for simple cases**

   ```tsx
   // Good - Quick implementation
   <MenuButton label="Actions" variant="primary">
     <MenuItem>Action 1</MenuItem>
     <MenuItem>Action 2</MenuItem>
   </MenuButton>
   ```

2. **Use MenuTrigger for custom trigger buttons**

   ```tsx
   // Good - Custom trigger
   <MenuTrigger>
     <IconButton variant="subtle" aria-label="Options">
       <IconMoreVertical />
     </IconButton>
     <MenuPopover>
       <Menu>{/* items */}</Menu>
     </MenuPopover>
   </MenuTrigger>
   ```

3. **Group related items with MenuSection**

   ```tsx
   // Good - Logical grouping
   <Menu>
     <MenuSection>
       <MenuHeading>File</MenuHeading>
       <MenuItem>New</MenuItem>
       <MenuItem>Open</MenuItem>
     </MenuSection>
     <MenuSeparator />
     <MenuSection>
       <MenuHeading>Edit</MenuHeading>
       <MenuItem>Cut</MenuItem>
       <MenuItem>Copy</MenuItem>
     </MenuSection>
   </Menu>
   ```

4. **Use MenuDescription for clarification**

   ```tsx
   // Good - Helpful context
   <MenuItem>
     <MenuLabel>Archive</MenuLabel>
     <MenuDescription>Move to long-term storage</MenuDescription>
   </MenuItem>
   ```

5. **Display keyboard shortcuts when relevant**

   ```tsx
   // Good - Helps users learn shortcuts
   <MenuItem>
     <MenuLabel>Save</MenuLabel>
     <MenuShortcut>⌘S</MenuShortcut>
   </MenuItem>
   ```

6. **Use design tokens for all styling**

   ```tsx
   // Good - Uses CSS variables from theme
   // All styling is handled by the component classes
   <MenuItem>
     <MenuLabel>Action</MenuLabel>
   </MenuItem>
   ```

### DON'T ❌

1. **Don't create custom menu styling**

   ```tsx
   // Bad - Custom CSS overrides
   <Menu className="my-custom-menu-styles">
   ```

2. **Don't hardcode colors or spacing**

   ```tsx
   // Bad
   <MenuItem style={{ padding: "12px", color: "#1e1e1e" }}>
   ```

3. **Don't use Menu for navigation**

   ```tsx
   // Bad - Use Navigation/NavigationPills instead
   <MenuButton label="Pages">
     <MenuItem href="/home">Home</MenuItem>
     <MenuItem href="/about">About</MenuItem>
   </MenuButton>
   ```

4. **Don't nest complex components in MenuItem**

   ```tsx
   // Bad - Keep items simple
   <MenuItem>
     <div className="complex-custom-layout">
       <CustomComponent />
     </div>
   </MenuItem>
   ```

5. **Don't forget textValue for accessibility**

   ```tsx
   // Bad - Missing textValue when children aren't plain text
   <MenuItem>
     <MenuLabel>Action</MenuLabel>
   </MenuItem>

   // Good - textValue provided
   <MenuItem textValue="Action">
     <MenuLabel>Action</MenuLabel>
   </MenuItem>
   ```

6. **Don't abuse MenuHeader**

   ```tsx
   // Bad - Headers should be rare
   <Menu>
     <MenuHeader>
       <ComplexHeaderComponent />
     </MenuHeader>
     {/* items */}
   </Menu>

   // Good - Simple context
   <Menu>
     <MenuHeader>
       <Text size="small">Workspace</Text>
     </MenuHeader>
     {/* items */}
   </Menu>
   ```

## Keyboard Navigation

Menus have full keyboard support:

- **Arrow Up/Down** - Navigate between items
- **Enter/Space** - Select item
- **Escape** - Close menu
- **Tab** - Move focus out of menu
- **Home/End** - Jump to first/last item
- **Type letters** - Jump to item starting with that letter

## Accessibility Features

1. **ARIA Attributes:** Automatically applied by React Aria
   - `role="menu"` on menu container
   - `role="menuitem"` on menu items
   - `aria-haspopup="menu"` on trigger
   - `aria-expanded` state management

2. **Focus Management:**
   - Focus moves to first item when menu opens
   - Focus returns to trigger when menu closes
   - Focus is trapped within menu when open

3. **Screen Reader Support:**
   - All items announce properly
   - Disabled state announced
   - Keyboard shortcuts announced

4. **Text Value:**
   - Always provide `textValue` prop when MenuItem children aren't plain text
   - Enables proper keyboard search and screen reader announcements

## Figma Implementation Notes

When implementing menu designs from Figma:

1. **Menu Container:**
   - Look for the "Menu" component frame
   - Note the border, shadow, and padding values
   - All should map to SDS design tokens

2. **Menu Structure:**
   - "Menu Header" → `<MenuHeader>`
   - "Menu Separator" → `<MenuSeparator>`
   - "Menu Section" → `<MenuSection>`
   - "Menu Item" → `<MenuItem>`

3. **Menu Item Composition:**
   - Icon/Star icon → Icon component as first child
   - "Menu Label" text → `<MenuLabel>`
   - "Menu description" text → `<MenuDescription>`
   - "Menu Shortcut" → `<MenuShortcut>`

4. **Extract Design Tokens:**
   - All colors use `var(--sds-color-*)` tokens
   - All spacing uses `var(--sds-size-space-*)` tokens
   - All typography uses `var(--sds-font-*)` tokens

5. **Component Annotations:**
   - Figma notes: "This is an example of a composed menu. If you require a different composition, you can build one using the Primitives."
   - Keywords: `popover`

## Related Components

- **Button/IconButton** - Used as menu triggers
- **Icon** - Used in menu items
- **Label** - Base for MenuLabel
- **Description** - Base for MenuDescription
- **Keyboard** - Base for MenuShortcut
- **TextHeading** - Used in MenuHeader
- **Text** - Used for menu content
- **Popover** - Underlying container (React Aria)
- **Navigation** - Alternative for navigation links

## Common Use Cases

1. **Action Menus** - Lists of actions (Edit, Delete, Share, etc.)
2. **Context Menus** - Right-click or three-dot menus
3. **Dropdown Menus** - Options triggered from buttons
4. **Settings Menus** - Configuration options
5. **More Actions** - Overflow menus for additional actions

## Keywords

menu, dropdown, context menu, popover, actions, options, menuitem, submenu, keyboard shortcuts
