/**
 * Main entry point for RKJat website
 */

import { initTheme } from './modules/theme';
import { initNavigation } from './modules/navigation';
import { initCanvas } from './modules/canvas';
import { initContent } from './modules/content';
import { initShareButtons } from './modules/share';
import { initContactForm } from './modules/form';

/**
 * Initialize all modules when DOM is ready
 */
function init(): void {
  // Core functionality
  initTheme();
  initNavigation();

  // Page-specific features
  initCanvas();
  initContent();
  initShareButtons();
  initContactForm();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export for potential external use
export { initTheme, initNavigation, initCanvas, initContent, initShareButtons, initContactForm };
