/**
 * Theme Module Tests
 */

import { vi } from 'vitest';
import { getCurrentTheme, setTheme, toggleTheme, initTheme, isDarkTheme } from './theme';

describe('Theme Module', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
    vi.clearAllMocks();
  });

  describe('getCurrentTheme', () => {
    it('should return current theme from document', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      expect(getCurrentTheme()).toBe('dark');
    });

    it('should default to light when no theme set', () => {
      expect(getCurrentTheme()).toBe('light');
    });
  });

  describe('isDarkTheme', () => {
    it('should return true when dark theme', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      expect(isDarkTheme()).toBe(true);
    });

    it('should return false when light theme', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      expect(isDarkTheme()).toBe(false);
    });
  });

  describe('setTheme', () => {
    it('should set light theme', () => {
      setTheme('light');
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    });

    it('should set dark theme', () => {
      setTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      document.documentElement.setAttribute('data-theme', 'light');
      toggleTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      document.documentElement.setAttribute('data-theme', 'dark');
      toggleTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('light');
    });
  });

  describe('initTheme', () => {
    it('should use stored theme if available', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('dark');
      initTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('should use system preference when no stored theme', () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);

      // Mock matchMedia to return dark preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: query.includes('dark'),
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      initTheme();
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });
  });
});
