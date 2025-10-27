# Contributing to entity-icons

Thank you for your interest in contributing to entity-icons! This guide will help you add new icons and maintain the package.

## Adding New Icons

### 1. Prepare Your SVG Files

Icons should meet these requirements:

- **ViewBox**: `0 0 24 24` (24x24 grid)
- **Format**: Clean SVG with no unnecessary attributes
- **Naming**: Use kebab-case (e.g., `arrow-right.svg`, `user-profile.svg`)
- **Style**: Consistent stroke width (2px recommended)
- **Color**: Use `currentColor` for strokes/fills that should be themeable

Example SVG:
```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  <path d="M12 5v14M5 12h14"/>
</svg>
```

### 2. Organize by Category

Place your SVG files in `src/svg/{category}/`:

```
src/svg/
├── system/          # UI controls (add, remove, close, etc.)
├── navigation/      # Arrows, chevrons, menu icons
├── communication/   # Mail, chat, phone icons
├── media/           # Play, pause, volume icons
├── brand/           # Social media, company logos
└── ...             # Add your own categories
```

### 3. Build the Icons

Run the build script to generate TypeScript components:

```bash
pnpm run build
```

This will:
1. Read all SVG files from `src/svg/`
2. Generate TSX components in `src/icons/{category}/`
3. Update the icon registry in `src/icons/index.ts`
4. Update TypeScript types with new icon names

### 4. Test Your Icons

```bash
# Run tests
pnpm run test

# Type check
pnpm run typecheck

# Lint code
pnpm run lint
```

### 5. Update the Changelog

Add your changes to `CHANGELOG.md` under the "Unreleased" section:

```markdown
## [Unreleased]

### Added
- New icons: ArrowLeft, ArrowRight, ArrowUp, ArrowDown
- Navigation category icons
```

## Development Workflow

### Setup

```bash
# Install dependencies
pnpm install

# Run in watch mode during development
pnpm run dev
```

### File Structure

```
entity-icons/
├── src/
│   ├── core/              # Core components and types
│   │   ├── IconBase.tsx   # Base SVG wrapper
│   │   ├── types.ts       # TypeScript types
│   │   └── index.ts       # Core API export
│   ├── icons/             # Generated icon components (auto-generated)
│   │   ├── system/
│   │   ├── navigation/
│   │   └── index.ts       # Icon registry (auto-generated)
│   └── svg/               # Source SVG files
│       ├── system/
│       └── navigation/
├── scripts/
│   └── build-icons.ts     # SVG → TSX generator
├── tests/
│   ├── setup.ts
│   └── IconBase.test.tsx
└── package.json
```

## Manual Icon Creation

If you need to create icons manually (without SVGs):

1. Create a new `.tsx` file in `src/icons/{category}/`:

```tsx
import { IconBase } from '../../core/IconBase';
import type { IconProps } from '../../core/types';

export function MyIcon(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </IconBase>
  );
}
```

2. Add it to `src/icons/index.ts`:

```tsx
import { MyIcon } from './category/MyIcon';

export { MyIcon };

export const registry: IconRegistry = {
  MyIcon,
  // ... other icons
};
```

3. Update the `IconName` type in `src/core/types.ts`:

```tsx
export type IconName =
  | 'MyIcon'
  | ... // other icon names
```

## Code Style

We use Biome for linting and formatting:

```bash
# Check code style
pnpm run lint

# Auto-fix issues
pnpm run lint:fix

# Format code
pnpm run format
```

## Testing

Add tests for new functionality in the `tests/` directory:

```tsx
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MyIcon } from '../src/icons/category/MyIcon';

describe('MyIcon', () => {
  it('renders correctly', () => {
    const { container } = render(<MyIcon />);
    expect(container.querySelector('svg')).toBeTruthy();
  });
});
```

## Release Process

1. Bump version: `pnpm version patch` (this updates package.json and creates a git tag)
2. Update `CHANGELOG.md` with changes
3. Commit changelog: `git commit -am "chore: update changelog for v0.0.x"`
4. Push: `git push && git push --tags`
5. Publish: `pnpm publish --access public`

## Versioning Guidelines

**Important**: This package stays in the 0.0.x range indefinitely.

We use **patch releases only** (0.0.x):

- **PATCH** (0.0.x): Everything - new icons, features, bug fixes
  - Adding new icons
  - Adding new features
  - Bug fixes
  - Documentation updates
  - Performance improvements

### No Major/Minor Releases

We will NOT bump to:
- 0.x.0 (minor versions)
- x.0.0 (major versions)

All changes are patch releases to keep the package stable and avoid ecosystem churn.

## Questions?

Open an issue on GitHub if you have questions or need help!

