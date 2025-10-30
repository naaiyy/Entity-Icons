import type { SVGAttributes } from 'react';

/**
 * Base props for all icon components
 */
export interface IconProps extends Omit<SVGAttributes<SVGElement>, 'color'> {
  /**
   * Size of the icon (width and height)
   * @default 24
   */
  size?: number | string;
  
  /**
   * Color of the icon
   * @default "currentColor"
   */
  color?: string;
  
  /**
   * Accessible title for the icon
   * When provided, the icon will have role="img"
   */
  title?: string;
  
  /**
   * ID for the title element (for aria-labelledby)
   * Auto-generated if not provided when title is set
   */
  titleId?: string;
  
  /**
   * Additional CSS class names
   */
  className?: string;
  
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Icon component type
 */
export type IconComponent = React.FC<IconProps>;

/**
 * Union type of all available icon names
 */
export type IconName =
  | 'GithubDark'
  | 'GithubLight'
  | 'Google'
  | 'PasskeyDark'
  | 'PasskeyLight'
  | 'AtSign'
  | 'Chat'
  | 'Folder'
  | 'Home'
  | 'Inbox'
  | 'Layers'
  | 'Password'
  | 'Settings'
  | 'Sparkle'
  | 'SquareGrid'
  | 'User'
  | 'Users';

/**
 * Registry mapping icon names to their components
 */
export type IconRegistry = Record<IconName, IconComponent>;
