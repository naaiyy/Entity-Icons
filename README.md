# entity-icons

Modern React icon library with ESM support, full TypeScript types, and excellent tree-shaking.

## Features

- ✨ **ESM-first** - Native ES modules with full tree-shaking support
- 🎨 **Customizable** - Size, color, and full SVG props control
- ♿ **Accessible** - Built-in ARIA support and semantic HTML
- 📦 **Lightweight** - Side-effect free, only bundle what you use
- 🔷 **TypeScript** - Fully typed with auto-generated icon names
- ⚛️ **React 18+** - Built for modern React applications

## Installation

```bash
npm install @entityy/entity-icons
# or
pnpm add @entityy/entity-icons
# or
yarn add @entityy/entity-icons
```

## Usage

### Named Imports (Recommended)

Best for tree-shaking. Only bundles the icons you import:

```tsx
import { Sparkle } from '@entityy/entity-icons';

function MyComponent() {
  return (
    <div>
      <Sparkle size={24} color="blue" />
      <Sparkle size={32} />
      <Sparkle color="currentColor" title="Sparkle Icon" />
    </div>
  );
}
```

### Dynamic Rendering with Core API

Use `core.render()` when you need to render icons dynamically by name:

```tsx
import core from '@entityy/entity-icons';

function DynamicIcon({ name }) {
  return core.render(name, { size: 24, color: 'blue' });
}

// Access the icon registry
const allIcons = Object.keys(core.registry);
console.log('Available icons:', allIcons);
```

### Creating Custom Icons

Use `IconBase` to create your own icons that match the library's style:

```tsx
import { IconBase } from '@entityy/entity-icons';
import type { IconProps } from '@entityy/entity-icons';

export function MyCustomIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
    </IconBase>
  );
}
```

## Package Name

This package is published as **`@entityy/entity-icons`** on npm.

## Cross-Platform Support

### Web / React
Use the npm package as documented below.

### iOS / macOS / Swift

Pre-built Apple assets are included in the npm package. **No build tools needed for users.**

#### Installation

```bash
npm install @entityy/entity-icons
```

#### Setup (One Time)

Copy the pre-built assets to your Xcode project:

```bash
# From your iOS/macOS project directory
cp -r node_modules/@entityy/entity-icons/apple/Assets.xcassets ./YourApp/
cp node_modules/@entityy/entity-icons/apple/EntityIcons.swift ./YourApp/
```

Then drag both files into Xcode.

#### Usage in SwiftUI

```swift
import SwiftUI

// Type-safe enum (recommended)
Image.entityIcon(.sparkle)
    .foregroundStyle(.blue)
    .frame(width: 24, height: 24)

// Or by name
Image("Sparkle")
    .renderingMode(.template)
    .foregroundStyle(.blue)
```

#### Usage in UIKit

```swift
let icon = EntityIcon.home.uiImage
imageView.image = icon
imageView.tintColor = .systemBlue
```

See [apple/README.md](./apple/README.md) for full documentation.

## API

### Icon Props

All icons accept these props:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Width and height of the icon |
| `color` | `string` | `"currentColor"` | Stroke color of the icon |
| `title` | `string` | - | Accessible title (adds role="img") |
| `titleId` | `string` | auto-generated | ID for the title element |
| `className` | `string` | - | CSS class names |
| `style` | `CSSProperties` | - | Inline styles |
| ...rest | `SVGAttributes` | - | All standard SVG attributes |

### Core API

```tsx
import core from '@entityy/entity-icons';

// Render an icon dynamically
core.render(iconName: string, props?: IconProps): JSX.Element | null

// Access the icon registry
core.registry: Record<IconName, IconComponent>

// Use the base component
core.IconBase: React.FC<IconProps & { children: ReactNode }>
```

## Accessibility

Icons are accessible by default:

```tsx
// Decorative icon (aria-hidden)
<Sparkle />

// Semantic icon (role="img" with label)
<Sparkle title="Sparkle effect" />

// Custom ARIA
<Sparkle title="Sparkle" titleId="sparkle-icon-1" />
```

## Tree Shaking

The package is optimized for tree-shaking:

```json
{
  "sideEffects": false,
  "type": "module"
}
```

Use named imports for best results:
```tsx
// ✅ Good - Only bundles Sparkle icon
import { Sparkle } from '@entityy/entity-icons';

// ⚠️ Less optimal - Bundles core + registry
import core from '@entityy/entity-icons';
const Icon = core.registry.Sparkle;
```

## Development

### Adding New Icons

1. Place SVG files in `src/svg/{category}/` directories:
```
src/svg/
├── system/
│   ├── add.svg
│   └── remove.svg
└── brand/
    ├── twitter.svg
    └── github.svg
```

2. Run the build script:
```bash
pnpm run build
```

The script will:
- Generate TSX components in `src/icons/{category}/`
- Update the icon registry
- Generate TypeScript types for all icon names

### SVG Requirements

- ViewBox should be `0 0 24 24`
- Use `currentColor` for strokes/fills that should be customizable
- Remove hardcoded stroke-width, stroke-linecap, stroke-linejoin (handled by IconBase)

### Scripts

```bash
pnpm run build          # Build icons and package
pnpm run dev            # Watch mode for development
pnpm run typecheck      # Type checking
pnpm run lint           # Lint code
pnpm run lint:fix       # Fix linting issues
pnpm run format         # Format code
pnpm run test           # Run tests
pnpm run test:watch     # Watch mode for tests
```

## Versioning

This package uses **patch releases only** and will remain in the `0.0.x` range. All updates (new icons, features, fixes) increment the patch version (e.g., 0.0.1 → 0.0.2).

## License

MIT © entityy

## Contributing

Contributions are welcome! Please read the contributing guidelines first.

