/**
 * Blog Article Page Entry Point
 * Initializes blog-specific features alongside main functionality
 */

import { initTheme } from './modules/theme';
import { initNavigation } from './modules/navigation';
import { initBlogArticle } from './modules/blog-article';

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Core features
  initTheme();
  initNavigation();

  // Blog-specific features
  initBlogArticle();
});
