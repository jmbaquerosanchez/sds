# Figma Icon Import

This folder contains scripts for automatically importing icons from Figma and generating React components.

## Automated Process

The automated script uses the Figma API to retrieve all the necessary information and generate icon components.

### Running the Script

```bash
npm run script:icons:rest
```

### What the Script Does

1. Connects to the Figma file through the Figma API
2. Retrieves all icon definitions
3. Generates React components for each icon in the `src/ds/ui/icons` folder
4. Creates an `index.ts` file for easy importing of all icons

### Output

All generated icon components are created as individual React component files in:

- `src/ds/ui/icons/` - Individual icon component files (e.g., `IconAdd.tsx`, `IconClose.tsx`)
- `src/ds/ui/icons/index.ts` - Barrel export file for convenient imports

### Usage Example

```tsx
import { IconAdd, IconClose } from "icons";

function MyComponent() {
  return (
    <div>
      <IconAdd />
      <IconClose />
    </div>
  );
}
```
