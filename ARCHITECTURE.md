# entity-icons Architecture

## Overview

`entity-icons` is a modern, ESM-first React icon library built with TypeScript. It provides excellent tree-shaking, full type safety, and multiple consumption patterns for maximum flexibility.

## Design Principles

1. **ESM-Only**: Native ES modules for modern bundlers
2. **Tree-Shakeable**: Side-effect free with optimal bundle splitting
3. **Type-Safe**: Fully typed with auto-generated icon name unions
4. **Accessible**: ARIA support and semantic HTML out of the box
5. **Flexible**: Multiple consumption patterns (named imports, dynamic rendering)
6. **Developer-Friendly**: Automatic SVG→TSX pipeline, no manual maintenance

## Package Structure

```
entity-icons/
├── src/
│   ├── core/                   # Core library code
│   │   ├── IconBase.tsx        # Shared SVG wrapper component
│   │   ├── types.ts            # TypeScript type definitions
│   │   └── index.ts            # Main export (core API)
│   │
│   ├── icons/                  # Generated icon components
│   │   ├── system/             # Category: system icons
│   │   │   ├── Add.tsx
│   │   │   ├── Remove.tsx
│   │   │   └── ...
│   │   ├── navigation/         # Category: navigation icons
│   │   ├── communication/      # Category: communication icons
│   │   └── index.ts            # Barrel export + registry
│   │
│   └── svg/                    # Source SVG files
│       ├── system/
│       │   ├── add.svg
│       │   └── remove.svg
│       └── navigation/
│
├── scripts/
│   └── build-icons.ts          # SVG→TSX generator
│
├── tests/
│   ├── setup.ts
│   └── IconBase.test.tsx
│
├── examples/
│   └── basic-usage.tsx
│
├── dist/                       # Built package (generated)
│   ├── index.js                # ESM bundle
│   ├── index.d.ts              # Type definitions
│   └── icons/                  # Individual icon modules
│
└── [config files]
```

## Core Components

### IconBase (`src/core/IconBase.tsx`)

The foundational SVG wrapper that all icons use. Provides:

- **Consistent sizing** via `size` prop (default: 24)
- **Themeable colors** via `color` prop (default: currentColor)
- **Accessibility** via `title`, `role`, `aria-*` attributes
- **Standard SVG props** forwarded to the `<svg>` element

```tsx
<IconBase size={24} color="blue" title="Add Icon">
  <path d="M12 5v14M5 12h14"/>
</IconBase>
```

Key features:
- Auto-generates `titleId` for ARIA when `title` is provided
- Sets `role="img"` when title is present, `aria-hidden` otherwise
- Sets `focusable="false"` to prevent keyboard focus issues
- Normalizes viewBox to `0 0 24 24`
- Default stroke properties: width=2, linecap=round, linejoin=round

### Types (`src/core/types.ts`)

Type definitions for the package:

- **`IconProps`**: Props interface for all icons
  - `size?: number | string`
  - `color?: string`
  - `title?: string`
  - `titleId?: string`
  - `className?: string`
  - `style?: CSSProperties`
  - Plus all standard `SVGAttributes`

- **`IconComponent`**: Type for icon components
  - `React.FC<IconProps>`

- **`IconName`**: Union of all available icon names (auto-generated)
  - `'Add' | 'Remove' | 'Search' | ...`

- **`IconRegistry`**: Type for the icon registry
  - `Record<IconName, IconComponent>`

### Core API (`src/core/index.ts`)

The default export that consumers import:

```tsx
import core from 'entity-icons';
```

Provides three main APIs:

1. **`core.render(name, props)`**: Dynamic icon rendering
   ```tsx
   core.render('Add', { size: 32, color: 'blue' })
   ```

2. **`core.registry`**: Full icon registry for discovery
   ```tsx
   const allIcons = Object.keys(core.registry);
   const AddComponent = core.registry.Add;
   ```

3. **`core.IconBase`**: Base component for custom icons
   ```tsx
   <core.IconBase {...props}>
     <path d="..." />
   </core.IconBase>
   ```

## Icon Components

### Generated Structure

Each icon is a separate React component:

```tsx
// src/icons/system/Add.tsx
import { IconBase } from '../../core/IconBase';
import type { IconProps } from '../../core/types';

export function Add(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14M5 12h14"/>
    </IconBase>
  );
}
```

### Registry (`src/icons/index.ts`)

Auto-generated barrel export with:

1. **Named exports** for tree-shaking:
   ```tsx
   export { Add, Remove, Search };
   ```

2. **Registry object** for dynamic access:
   ```tsx
   export const registry: IconRegistry = {
     Add,
     Remove,
     Search,
   };
   ```

## Build Pipeline

### SVG→TSX Conversion (`scripts/build-icons.ts`)

The build script automates icon generation:

1. **Scan** `src/svg/` for SVG files (organized by category)
2. **Parse** SVG content and extract paths
3. **Normalize** attributes:
   - Remove hardcoded colors (use `currentColor`)
   - Remove stroke properties (handled by IconBase)
   - Clean up unnecessary attributes
4. **Generate** TSX components in `src/icons/{category}/`
5. **Update** barrel export in `src/icons/index.ts`
6. **Update** type unions in `src/core/types.ts`

#### File Naming Convention

- **SVG files**: kebab-case (e.g., `arrow-left.svg`)
- **Component files**: PascalCase (e.g., `ArrowLeft.tsx`)
- **Export names**: PascalCase (e.g., `ArrowLeft`)

#### Category Organization

Icons are organized by category for better maintainability:

```
src/svg/
├── system/        # UI controls (add, remove, close)
├── navigation/    # Arrows, chevrons, menu
├── communication/ # Mail, chat, phone
├── media/         # Play, pause, volume
└── brand/         # Social media, logos
```

### Build Process

```bash
# 1. Generate icon components from SVGs
tsx scripts/build-icons.ts

# 2. Build package with tsup
tsup

# Combined (npm script)
pnpm run build
```

## Consumption Patterns

### 1. Named Imports (Recommended)

Best for tree-shaking - only bundles imported icons:

```tsx
import { Add, Remove, Search } from 'entity-icons';

<Add size={24} color="blue" />
```

**Bundle Impact**: Only the imported icons are included.

### 2. Dynamic Rendering

Use when icon name is determined at runtime:

```tsx
import core from 'entity-icons';

function DynamicIcon({ name }) {
  return core.render(name, { size: 24 });
}
```

**Bundle Impact**: Includes core API and registry (all icons).

### 3. Registry Access

For programmatic icon discovery:

```tsx
import core from 'entity-icons';

const iconNames = Object.keys(core.registry);
const IconComponent = core.registry.Add;
```

### 4. Custom Icons

Extend the library with your own icons:

```tsx
import { IconBase } from 'entity-icons';
import type { IconProps } from 'entity-icons';

export function CustomIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="..." />
    </IconBase>
  );
}
```

## Package Configuration

### package.json

Key configurations:

```json
{
  "type": "module",              // ESM-only
  "sideEffects": false,          // Tree-shaking
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./icons/*": "./dist/icons/*.js"
  },
  "peerDependencies": {
    "react": ">=18.0.0"          // Modern React only
  }
}
```

### tsconfig.json

TypeScript configuration:

- **Target**: ES2022
- **Module**: ESNext with bundler resolution
- **JSX**: react-jsx (automatic runtime)
- **Strict**: Full strict mode enabled
- **Declaration**: Generate .d.ts files

### tsup.config.ts

Build configuration:

- **Format**: ESM only
- **Entry**: `src/core/index.ts`
- **Output**: `dist/`
- **Features**: Source maps, type declarations, tree-shaking

## Accessibility

### Decorative Icons

Icons without semantic meaning:

```tsx
<Add />
```

Renders as:
```html
<svg aria-hidden="true" focusable="false">...</svg>
```

### Semantic Icons

Icons with meaning (using `title`):

```tsx
<Add title="Add new item" />
```

Renders as:
```html
<svg role="img" aria-labelledby="icon-xyz123">
  <title id="icon-xyz123">Add new item</title>
  ...
</svg>
```

### Screen Reader Support

- Decorative icons: Hidden from screen readers
- Semantic icons: Announced with the provided title
- Focus management: Icons are not focusable by default

## Performance Optimizations

1. **Tree-Shaking**: `sideEffects: false` enables aggressive tree-shaking
2. **Code Splitting**: Each icon is a separate module
3. **No Runtime Parsing**: SVGs are compiled to JSX at build time
4. **Minimal Runtime**: IconBase is tiny (~100 bytes)
5. **Static Analysis**: TypeScript enables compile-time optimizations

## Versioning Strategy

**This package remains in 0.0.x range permanently.**

All changes are patch releases (0.0.x):
- Adding new icons → 0.0.x
- Adding features → 0.0.x
- Bug fixes → 0.0.x
- Documentation → 0.0.x
- Performance improvements → 0.0.x

We avoid major/minor version bumps to maintain stability and prevent dependency ecosystem churn.

## Testing Strategy

1. **Unit Tests**: Test IconBase and core components
2. **Snapshot Tests**: Verify icon rendering consistency
3. **Type Tests**: Ensure TypeScript types are correct
4. **Build Tests**: Verify the build pipeline works

```bash
pnpm run test           # Run all tests
pnpm run test:watch     # Watch mode
pnpm run typecheck      # Type checking
```

## Future Enhancements

Possible additions (not in v0.1.0):

1. **Multiple icon sets**: System, outline, filled variants
2. **Icon transformations**: Rotate, flip, animations
3. **React Server Components**: RSC-compatible exports
4. **Figma plugin**: Auto-sync with Figma designs
5. **Icon search**: Web interface for browsing icons
6. **CLI tool**: Generate custom icon sets
7. **Themes**: Predefined color schemes

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on:
- Adding new icons
- Creating categories
- Build process
- Testing
- Release workflow

