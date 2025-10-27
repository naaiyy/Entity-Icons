import type { IconProps } from './types';

/**
 * Base icon wrapper component
 * Provides consistent sizing, colors, and accessibility
 */
export function IconBase({
  children,
  size = 24,
  color = 'currentColor',
  title,
  titleId,
  className,
  style,
  ...props
}: IconProps & { children: React.ReactNode }) {
  const generatedTitleId = titleId || (title ? `icon-${Math.random().toString(36).slice(2, 9)}` : undefined);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-labelledby={generatedTitleId}
      focusable="false"
      className={className}
      style={style}
      {...props}
    >
      {title && <title id={generatedTitleId}>{title}</title>}
      {children}
    </svg>
  );
}

