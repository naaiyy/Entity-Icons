#!/usr/bin/env tsx

import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ROOT_DIR = path.resolve(__dirname, '..');
const SVG_DIR = path.join(ROOT_DIR, 'src', 'svg');
const ASSETS_DIR = path.join(ROOT_DIR, 'apple', 'Assets.xcassets');
const TMP_DIR = path.join(ROOT_DIR, 'tmp');

interface IconInfo {
  name: string;
  pascalName: string;
  category: string;
  svgPath: string;
}

/**
 * Convert kebab-case to PascalCase
 */
function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
}

/**
 * Check if required tools are installed
 */
async function checkDependencies(): Promise<void> {
  console.log('🔍 Checking dependencies...');
  
  try {
    await execAsync('which rsvg-convert');
    console.log('✓ rsvg-convert found');
  } catch {
    try {
      await execAsync('which inkscape');
      console.log('✓ inkscape found');
    } catch {
      console.error('❌ Error: Neither rsvg-convert nor inkscape found.');
      console.error('   Install one of them:');
      console.error('   - macOS: brew install librsvg (for rsvg-convert)');
      console.error('   - macOS: brew install inkscape');
      process.exit(1);
    }
  }
}

/**
 * Scan SVG directory and collect all icons
 */
async function collectIcons(): Promise<IconInfo[]> {
  const icons: IconInfo[] = [];

  try {
    const categories = await fs.readdir(SVG_DIR);

    for (const category of categories) {
      if (category.startsWith('.')) continue;
      
      const categoryPath = path.join(SVG_DIR, category);
      const stat = await fs.stat(categoryPath);

      if (!stat.isDirectory()) continue;

      const files = await fs.readdir(categoryPath);

      for (const file of files) {
        if (!file.endsWith('.svg')) continue;

        const name = file.replace('.svg', '');
        const pascalName = toPascalCase(name);
        const svgPath = path.join(categoryPath, file);

        icons.push({
          name,
          pascalName,
          category,
          svgPath,
        });
      }
    }
  } catch (error) {
    console.error('Error scanning SVG directory:', error);
    return [];
  }

  return icons;
}

/**
 * Convert SVG to PDF using available tool
 */
async function convertSvgToPdf(svgPath: string, pdfPath: string): Promise<void> {
  try {
    // Try rsvg-convert first (faster and lighter)
    await execAsync(`rsvg-convert -f pdf -o "${pdfPath}" "${svgPath}"`);
  } catch {
    try {
      // Fall back to inkscape
      await execAsync(`inkscape "${svgPath}" --export-type=pdf --export-filename="${pdfPath}"`);
    } catch (error) {
      throw new Error(`Failed to convert ${svgPath}: ${error}`);
    }
  }
}

/**
 * Generate Contents.json for asset catalog
 */
function generateContentsJson(filename: string): string {
  return JSON.stringify(
    {
      images: [
        {
          idiom: 'universal',
          filename: filename,
        },
      ],
      info: {
        version: 1,
        author: 'xcode',
      },
      properties: {
        'template-rendering-intent': 'template',
        'preserves-vector-representation': true,
      },
    },
    null,
    2
  );
}

/**
 * Generate Swift enum for type-safe icon access
 */
async function generateSwiftEnum(icons: IconInfo[]): Promise<void> {
  const enumCases = icons
    .map((icon) => `    case ${icon.name.replace(/-/g, '_')} = "${icon.pascalName}"`)
    .join('\n');

  const swiftCode = `//
//  EntityIcons.swift
//  Generated from @entityy/entity-icons
//
//  DO NOT EDIT - This file is auto-generated
//

import SwiftUI

/// Type-safe access to Entity Icons
public enum EntityIcon: String, CaseIterable {
${enumCases}
    
    /// SwiftUI Image for this icon
    public var image: Image {
        Image(self.rawValue)
            .renderingMode(.template)
    }
    
    /// UIKit UIImage for this icon
    #if canImport(UIKit)
    public var uiImage: UIImage? {
        UIImage(named: self.rawValue)?.withRenderingMode(.alwaysTemplate)
    }
    #endif
    
    /// AppKit NSImage for this icon
    #if canImport(AppKit)
    public var nsImage: NSImage? {
        if let image = NSImage(named: self.rawValue) {
            image.isTemplate = true
            return image
        }
        return nil
    }
    #endif
}

// MARK: - SwiftUI View Extension
extension Image {
    /// Create an Entity Icon with template rendering
    public static func entityIcon(_ icon: EntityIcon) -> Image {
        icon.image
    }
}
`;

  const swiftPath = path.join(ROOT_DIR, 'apple', 'EntityIcons.swift');
  await fs.writeFile(swiftPath, swiftCode, 'utf-8');
  console.log('✓ Generated Swift enum: apple/EntityIcons.swift');
}

/**
 * Main build process
 */
async function main() {
  console.log('🍎 Building Apple assets from entity-icons...\n');

  // Check dependencies
  await checkDependencies();

  // Collect icons
  const icons = await collectIcons();

  if (icons.length === 0) {
    console.log('⚠️  No icons found in src/svg/');
    return;
  }

  console.log(`\n📦 Found ${icons.length} icons\n`);

  // Create directories
  await fs.mkdir(TMP_DIR, { recursive: true });
  await fs.mkdir(ASSETS_DIR, { recursive: true });

  // Process each icon
  for (const icon of icons) {
    try {
      console.log(`   Processing ${icon.name}...`);

      // Convert SVG to PDF
      const pdfPath = path.join(TMP_DIR, `${icon.pascalName}.pdf`);
      await convertSvgToPdf(icon.svgPath, pdfPath);

      // Create imageset directory
      const imagesetDir = path.join(ASSETS_DIR, `${icon.pascalName}.imageset`);
      await fs.mkdir(imagesetDir, { recursive: true });

      // Copy PDF to imageset
      const destPdfPath = path.join(imagesetDir, `${icon.pascalName}.pdf`);
      await fs.copyFile(pdfPath, destPdfPath);

      // Generate Contents.json
      const contentsJson = generateContentsJson(`${icon.pascalName}.pdf`);
      const contentsPath = path.join(imagesetDir, 'Contents.json');
      await fs.writeFile(contentsPath, contentsJson, 'utf-8');
    } catch (error) {
      console.error(`   ❌ Failed to process ${icon.name}:`, error);
    }
  }

  // Generate root Contents.json for asset catalog
  const rootContents = {
    info: {
      version: 1,
      author: 'xcode',
    },
  };
  await fs.writeFile(
    path.join(ASSETS_DIR, 'Contents.json'),
    JSON.stringify(rootContents, null, 2),
    'utf-8'
  );

  // Generate Swift enum
  await generateSwiftEnum(icons);

  // Clean up tmp directory
  await fs.rm(TMP_DIR, { recursive: true, force: true });

  console.log(`\n✅ Successfully built ${icons.length} Apple assets!`);
  console.log(`\n📁 Output:`);
  console.log(`   • Assets: apple/Assets.xcassets/`);
  console.log(`   • Swift enum: apple/EntityIcons.swift`);
  console.log(`\n💡 Usage in SwiftUI:`);
  console.log(`   Image.entityIcon(.sparkle)`);
  console.log(`     .foregroundStyle(.blue)`);
  console.log(`     .frame(width: 24, height: 24)`);
}

main().catch((error) => {
  console.error('❌ Build failed:', error);
  process.exit(1);
});

