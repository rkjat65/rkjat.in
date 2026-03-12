/**
 * Main entry point for DAwithRK website
 */

import { initTheme } from './modules/theme';\nimport { initNavigation } from './modules/navigation';\nimport { initCanvas } from './modules/canvas';\nimport { initContent } from './modules/content';\nimport { initShareButtons } from './modules/share';
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
export {
  initTheme,
  initNavigation,
  initCanvas,
  initContent,
  initShareButtons,
  initContactForm,
};
