# Quick Setup Guide for entity-icons

## Initial Setup

### 1. Install Dependencies

```bash
cd /Users/naaiyy/Developer/EntityWorkspace/Entity-UI/Entity-Icons
pnpm install
```

### 2. Add Your Icons

Place your SVG files in organized categories:

```bash
# Create category directories
mkdir -p src/svg/system
mkdir -p src/svg/navigation
mkdir -p src/svg/communication
mkdir -p src/svg/media
mkdir -p src/svg/brand

# Add your SVG files
# For example:
# src/svg/system/add.svg
# src/svg/system/remove.svg
# src/svg/navigation/arrow-left.svg
# src/svg/navigation/arrow-right.svg
```

**SVG Format Requirements:**
- ViewBox: `0 0 24 24`
- Use `currentColor` for themeable colors
- Clean, optimized paths
- kebab-case filenames (e.g., `arrow-right.svg`)

### 3. Build the Package

```bash
# Generate TypeScript components from SVGs
pnpm run build
```

This will:
- ✅ Convert SVGs to TSX components
- ✅ Generate the icon registry
- ✅ Update TypeScript types
- ✅ Build the distributable package

### 4. Test Your Package

```bash
# Run tests
pnpm run test

# Type check
pnpm run typecheck

# Lint
pnpm run lint
```

### 5. Test Locally in Another Project

Before publishing, test the package locally:

```bash
# In the entity-icons directory
pnpm pack

# This creates entity-icons-0.0.1.tgz

# In your test project
pnpm add /path/to/entity-icons-0.0.1.tgz
```

Then in your test project:

```tsx
import core from 'entity-icons';
import { Add, Remove } from 'entity-icons';

function App() {
  return <Add size={24} color="blue" />;
}
```

### 6. Publish to npm

Before your first publish:

```bash
# Login to npm
npm login

# Update package.json with your info:
# - repository URL
# - author
# - keywords
```

Then publish:

```bash
# Dry run (see what will be published)
pnpm publish --dry-run

# Publish (public package)
pnpm publish --access public
```

## Development Workflow

### Watch Mode

For active development:

```bash
pnpm run dev
```

This watches for changes and rebuilds automatically.

### Adding Icons

1. Add SVG file to `src/svg/{category}/icon-name.svg`
2. Run `pnpm run build`
3. Icons are automatically generated in `src/icons/{category}/IconName.tsx`
4. Test with `pnpm run test`
5. Commit changes

### Version Bumping

**We only use patch releases (0.0.x):**

```bash
# Patch release for EVERYTHING (new icons, features, fixes)
pnpm version patch

# This bumps 0.0.1 → 0.0.2, then 0.0.2 → 0.0.3, etc.
```

**Never** use minor or major version bumps. The package stays in 0.0.x range.

## Package Structure

```
entity-icons/
├── src/
│   ├── core/              # Core components (IconBase, types, API)
│   ├── icons/             # Generated TSX components ⚠️ AUTO-GENERATED
│   └── svg/               # Source SVG files ✏️ EDIT THESE
│
├── dist/                  # Built package ⚠️ AUTO-GENERATED
│   ├── index.js
│   ├── index.d.ts
│   └── icons/
│
├── scripts/
│   └── build-icons.ts     # SVG → TSX generator
│
├── tests/                 # Test files
├── examples/              # Usage examples
└── package.json
```

## What to Provide

I need from you:

### 1. **SVG Files** (Required)
- Your icon SVG files (TSX also works)
- Organized by category if possible
- Format: 24x24 viewBox, clean paths

### 2. **Package Metadata** (Optional, but recommended)
Update in `package.json`:
- `repository.url` - Your Git repository URL
- `author` - Your name/organization
- `keywords` - Additional searchable keywords
- `description` - Custom description

### 3. **Branding** (Optional)
- Custom README sections
- Logo or badges
- Documentation site URL

## Current Status

✅ Package structure created  
✅ Build pipeline configured  
✅ TypeScript types set up  
✅ Test framework ready  
✅ Example icons (add, remove, search)  
⏳ Waiting for your icon SVGs/TSX  

## Next Steps

1. **Share your icons** - Provide SVG or TSX files
2. **Organize** - Tell me which categories you want (system, navigation, etc.)
3. **Build** - Run `pnpm install && pnpm run build`
4. **Test locally** - Try in another project
5. **Publish** - Push to npm when ready

## Questions?

- **Q: Can I mix SVG and TSX icons?**  
  A: Yes! Place SVGs in `src/svg/` and manually create TSX in `src/icons/` if needed.

- **Q: How do I customize the build process?**  
  A: Edit `scripts/build-icons.ts` to modify SVG parsing and component generation.

- **Q: What if my SVGs have fills instead of strokes?**  
  A: Modify `IconBase.tsx` to use `fill` instead of `stroke`, or handle both.

- **Q: Can I publish to a scoped package (@myorg/icons)?**  
  A: Yes! Change `"name": "entity-icons"` to `"name": "@myorg/icons"` in package.json.

