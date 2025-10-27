import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IconBase } from '../src/core/IconBase';

describe('IconBase', () => {
  it('renders with default props', () => {
    const { container } = render(
      <IconBase>
        <path d="M5 12h14" />
      </IconBase>
    );
    
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('width')).toBe('24');
    expect(svg?.getAttribute('height')).toBe('24');
    expect(svg?.getAttribute('stroke')).toBe('currentColor');
  });

  it('renders with custom size', () => {
    const { container } = render(
      <IconBase size={32}>
        <path d="M5 12h14" />
      </IconBase>
    );
    
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('width')).toBe('32');
    expect(svg?.getAttribute('height')).toBe('32');
  });

  it('renders with custom color', () => {
    const { container } = render(
      <IconBase color="red">
        <path d="M5 12h14" />
      </IconBase>
    );
    
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('stroke')).toBe('red');
  });

  it('renders with title for accessibility', () => {
    const { container } = render(
      <IconBase title="Test Icon">
        <path d="M5 12h14" />
      </IconBase>
    );
    
    const svg = container.querySelector('svg');
    const title = container.querySelector('title');
    
    expect(svg?.getAttribute('role')).toBe('img');
    expect(svg?.getAttribute('aria-hidden')).toBeNull();
    expect(title?.textContent).toBe('Test Icon');
  });

  it('renders without title (decorative)', () => {
    const { container } = render(
      <IconBase>
        <path d="M5 12h14" />
      </IconBase>
    );
    
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('role')).toBeNull();
    expect(svg?.getAttribute('aria-hidden')).toBe('true');
  });

  it('applies custom className', () => {
    const { container } = render(
      <IconBase className="custom-class">
        <path d="M5 12h14" />
      </IconBase>
    );
    
    const svg = container.querySelector('svg');
    expect(svg?.classList.contains('custom-class')).toBe(true);
  });
});

