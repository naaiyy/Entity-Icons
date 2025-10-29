/**
 * Basic usage examples for @entityy/entity-icons
 * These examples show different ways to use the icon library
 */

import core from '@entityy/entity-icons';
import { Sparkle } from '@entityy/entity-icons';
import type { IconProps } from '@entityy/entity-icons';

// Example 1: Named imports (recommended for best tree-shaking)
export function Example1() {
  return (
    <div>
      <Sparkle size={24} color="blue" />
      <Sparkle size={32} color="red" />
      <Sparkle size={20} color="gray" />
    </div>
  );
}

// Example 2: Dynamic rendering with core.render()
export function Example2({ iconName }: { iconName: string }) {
  return <div>{core.render(iconName, { size: 24, color: 'blue' })}</div>;
}

// Example 3: Accessible icons with titles
export function Example3() {
  return (
    <div>
      <Sparkle title="Add sparkle effect" size={24} />
      <Sparkle title="Sparkle" size={24} />
      <Sparkle title="Sparkle" titleId="sparkle-icon-1" size={24} />
    </div>
  );
}

// Example 4: Custom styling
export function Example4() {
  return (
    <div>
      <Sparkle
        size={40}
        color="purple"
        className="my-icon-class"
        style={{ cursor: 'pointer' }}
        onClick={() => console.log('Icon clicked!')}
      />
    </div>
  );
}

// Example 5: Icon grid from registry
export function Example5() {
  const iconNames = Object.keys(core.registry);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
      {iconNames.map((name) => (
        <div key={name} style={{ textAlign: 'center' }}>
          {core.render(name, { size: 32 })}
          <p style={{ fontSize: '0.75rem' }}>{name}</p>
        </div>
      ))}
    </div>
  );
}

// Example 6: Custom icon using IconBase
export function CustomHeartIcon(props: IconProps) {
  return (
    <core.IconBase {...props}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </core.IconBase>
  );
}

// Example 7: Icon button component
export function IconButton({
  icon,
  label,
  onClick,
}: {
  icon: keyof typeof core.registry;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        border: '1px solid #ccc',
        borderRadius: '0.25rem',
        background: 'white',
        cursor: 'pointer',
      }}
    >
      {core.render(icon, { size: 20 })}
      <span>{label}</span>
    </button>
  );
}

// Example 8: Responsive icon sizes
export function Example8() {
  return (
    <div>
      {/* Small */}
      <Sparkle size={16} />

      {/* Medium (default) */}
      <Sparkle size={24} />

      {/* Large */}
      <Sparkle size={32} />

      {/* Extra large */}
      <Sparkle size={48} />

      {/* String size (em-based) */}
      <Sparkle size="2em" />
    </div>
  );
}

// Example 9: Theme-aware icons (using currentColor)
export function Example9() {
  return (
    <div style={{ color: 'blue' }}>
      {/* These icons will inherit the blue color */}
      <Sparkle />
      <Sparkle />
      <Sparkle />
    </div>
  );
}

// Example 10: Icon with custom SVG props
export function Example10() {
  return (
    <Sparkle
      size={32}
      strokeWidth={3}
      strokeLinecap="square"
      strokeLinejoin="miter"
      opacity={0.7}
    />
  );
}
