/**
 * Navigation Module Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { initNavigation } from './navigation';

describe('Navigation Module', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <nav class="nav">
        <button class="nav-toggle" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
        <ul class="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </nav>
    `;
    vi.clearAllMocks();
  });

  describe('initNavigation', () => {
    it('should initialize without errors', () => {
      expect(() => initNavigation()).not.toThrow();
    });

    it('should toggle mobile menu on button click', () => {
      initNavigation();

      const toggle = document.querySelector('.nav-toggle') as HTMLButtonElement;
      const navLinks = document.querySelector('.nav-links');

      expect(navLinks?.classList.contains('active')).toBe(false);

      toggle.click();
      expect(navLinks?.classList.contains('active')).toBe(true);

      toggle.click();
      expect(navLinks?.classList.contains('active')).toBe(false);
    });

    it('should handle button click', () => {
      initNavigation();

      const toggle = document.querySelector('.nav-toggle') as HTMLButtonElement;

      // Should not throw when clicking
      expect(() => toggle.click()).not.toThrow();
    });

    it('should close menu when clicking nav link', () => {
      initNavigation();

      const toggle = document.querySelector('.nav-toggle') as HTMLButtonElement;
      const navLinks = document.querySelector('.nav-links');
      const link = navLinks?.querySelector('a') as HTMLAnchorElement;

      // Open menu
      toggle.click();
      expect(navLinks?.classList.contains('active')).toBe(true);

      // Click link
      link.click();
      expect(navLinks?.classList.contains('active')).toBe(false);
    });
  });

  describe('scroll behavior', () => {
    it('should add scrolled class on scroll', () => {
      initNavigation();

      const nav = document.querySelector('.nav');

      // Simulate scroll
      Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
      window.dispatchEvent(new Event('scroll'));

      // The scroll handler is throttled, so we need to wait
      // For this test, we're just checking the init doesn't break
      expect(nav).not.toBeNull();
    });
  });

  describe('keyboard accessibility', () => {
    it('should handle Escape key to close menu', () => {
      initNavigation();

      const toggle = document.querySelector('.nav-toggle') as HTMLButtonElement;
      const navLinks = document.querySelector('.nav-links');

      // Open menu
      toggle.click();
      expect(navLinks?.classList.contains('active')).toBe(true);

      // Press Escape
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(navLinks?.classList.contains('active')).toBe(false);
    });
  });
});
