/**
 * Theme management module
 */

import type { Theme } from '../types';
import { SELECTORS, DATA_ATTRS, STORAGE_KEYS } from './constants';
import { getElement, addListener } from './utils';

/**
 * Get the current theme from document
 */
export function getCurrentTheme(): Theme {
  return (document.documentElement.getAttribute(DATA_ATTRS.theme) as Theme) ?? 'light';
}

/**
 * Check if the current theme is dark
 */
export function isDarkTheme(): boolean {
  return getCurrentTheme() === 'dark';
}

/**
 * Set the theme and persist to localStorage
 */
export function setTheme(theme: Theme): void {
  document.documentElement.setAttribute(DATA_ATTRS.theme, theme);
  localStorage.setItem(STORAGE_KEYS.theme, theme);
  updateThemeIcon();
  dispatchThemeChange(theme);
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme(): void {
  const current = getCurrentTheme();
  const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
}

/**
 * Update the theme toggle button icon
 */
export function updateThemeIcon(): void {
  const toggle = getElement(SELECTORS.themeToggle);
  if (toggle) {
    toggle.textContent = isDarkTheme() ? '\u2600\uFE0F' : '\uD83C\uDF19';
  }
}

/**
 * Dispatch a custom event when theme changes
 */
function dispatchThemeChange(theme: Theme): void {
  const event = new CustomEvent('themeChange', { detail: { theme } });
  document.dispatchEvent(event);
}

/**
 * Get the initial theme based on saved preference or system preference
 */
function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEYS.theme) as Theme | null;

  if (saved && (saved === 'light' || saved === 'dark')) {
    return saved;
  }

  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  return 'light';
}

/**
 * Initialize theme management
 */
export function initTheme(): void {
  // Set initial theme
  const initialTheme = getInitialTheme();
  document.documentElement.setAttribute(DATA_ATTRS.theme, initialTheme);
  updateThemeIcon();

  // Add click listener to toggle button
  addListener(SELECTORS.themeToggle, 'click', () => {
    toggleTheme();
  });

  // Listen for system preference changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem(STORAGE_KEYS.theme)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}
