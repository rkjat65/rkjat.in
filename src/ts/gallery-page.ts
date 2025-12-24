/**
 * Gallery page entry point
 */

import { initTheme } from './modules/theme';
import { initNavigation } from './modules/navigation';
import { initGallery, Gallery } from './modules/gallery';

let galleryInstance: Gallery | null = null;

/**
 * Initialize gallery page
 */
function init(): void {
  // Core functionality
  initTheme();
  initNavigation();

  // Gallery-specific
  galleryInstance = initGallery();
}

/**
 * Get the gallery instance (useful for debugging)
 */
export function getGallery(): Gallery | null {
  return galleryInstance;
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Export gallery for external use
export { Gallery };
