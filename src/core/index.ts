import React from 'react';
import { registry } from '../icons/index';
import { IconBase } from './IconBase';
import type { IconComponent, IconName, IconProps, IconRegistry } from './types';

/**
 * Render an icon dynamically by name
 */
function render(name: IconName, props?: IconProps): React.ReactElement | null {
  const IconComponent = registry[name as keyof typeof registry];
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }
  return React.createElement(IconComponent, props);
}

/**
 * Core API for entity-icons
 */
const core = {
  /**
   * Dynamically render an icon by name
   * @example
   * ```tsx
   * core.render('Add', { size: 32, color: 'blue' })
   * ```
   */
  render,

  /**
   * Registry of all available icons
   * @example
   * ```tsx
   * const iconNames = Object.keys(core.registry);
   * const AddIcon = core.registry.Add;
   * ```
   */
  registry,

  /**
   * Base icon component for creating custom icons
   * @example
   * ```tsx
   * export const CustomIcon = (props) => (
   *   <core.IconBase {...props}>
   *     <path d="..." />
   *   </core.IconBase>
   * );
   * ```
   */
  IconBase,
};

export default core;

// Re-export types for convenience
export type { IconProps, IconComponent, IconName, IconRegistry };
export { IconBase };

// Re-export all individual icons for named imports
export * from '../icons/index';
