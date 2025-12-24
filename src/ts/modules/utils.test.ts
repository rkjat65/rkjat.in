/**
 * Utils Module Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  debounce,
  throttle,
  getElement,
  getElements,
  formatDate,
  clamp,
  stripHtml,
  encodeParams,
  isMobile,
  prefersReducedMotion,
} from './utils';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should delay function execution', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should cancel previous calls when called again', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    vi.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should pass arguments to the function', () => {
    const fn = vi.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn('arg1', 'arg2');
    vi.advanceTimersByTime(100);

    expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
  });
});

describe('throttle', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should execute immediately on first call', () => {
    const fn = vi.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it('should throttle subsequent calls', () => {
    const fn = vi.fn();
    const throttledFn = throttle(fn, 100);

    throttledFn();
    throttledFn();
    throttledFn();

    expect(fn).toHaveBeenCalledTimes(1);

    vi.advanceTimersByTime(100);
    throttledFn();
    expect(fn).toHaveBeenCalledTimes(2);
  });
});

describe('getElement', () => {
  it('should return element when found', () => {
    document.body.innerHTML = '<div id="test">Test</div>';
    const element = getElement<HTMLDivElement>('#test');
    expect(element).not.toBeNull();
    expect(element?.id).toBe('test');
  });

  it('should return null when element not found', () => {
    document.body.innerHTML = '';
    const element = getElement('#nonexistent');
    expect(element).toBeNull();
  });
});

describe('getElements', () => {
  it('should return all matching elements', () => {
    document.body.innerHTML = `
      <div class="item">1</div>
      <div class="item">2</div>
      <div class="item">3</div>
    `;
    const elements = getElements('.item');
    expect(elements).toHaveLength(3);
  });

  it('should return empty NodeList when no elements found', () => {
    document.body.innerHTML = '';
    const elements = getElements('.nonexistent');
    expect(elements).toHaveLength(0);
  });
});

describe('formatDate', () => {
  it('should format date string correctly', () => {
    const result = formatDate('2024-01-15');
    // Format is 'Jan 15, 2024'
    expect(result).toContain('15');
    expect(result).toContain('2024');
  });

  it('should handle different date formats', () => {
    const result = formatDate('2024-06-20');
    expect(result).toContain('20');
    expect(result).toContain('2024');
  });
});

describe('clamp', () => {
  it('should return value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('should return min when value is below range', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('should return max when value is above range', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });
});

describe('stripHtml', () => {
  it('should remove HTML tags', () => {
    expect(stripHtml('<p>Hello <strong>World</strong></p>')).toBe('Hello World');
  });

  it('should handle empty string', () => {
    expect(stripHtml('')).toBe('');
  });
});

describe('encodeParams', () => {
  it('should encode parameters correctly', () => {
    const result = encodeParams({ foo: 'bar', hello: 'world' });
    expect(result).toBe('foo=bar&hello=world');
  });

  it('should handle special characters', () => {
    const result = encodeParams({ text: 'hello world' });
    expect(result).toBe('text=hello%20world');
  });
});

describe('isMobile', () => {
  it('should return true for small viewports', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
    expect(isMobile()).toBe(true);
  });

  it('should return false for large viewports', () => {
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
    expect(isMobile()).toBe(false);
  });

  it('should use custom breakpoint', () => {
    Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
    expect(isMobile(400)).toBe(false);
  });
});

describe('prefersReducedMotion', () => {
  it('should return boolean', () => {
    const result = prefersReducedMotion();
    expect(typeof result).toBe('boolean');
  });
});
