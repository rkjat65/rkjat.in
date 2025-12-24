/**
 * Application constants and configuration
 */

import type { ParticleConfig } from '../types';

// Breakpoints
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1400,
} as const;

// Particle animation configuration
export const PARTICLE_CONFIG: Record<'mobile' | 'desktop', ParticleConfig> = {
  mobile: {
    particleCount: 30,
    connectionDistance: 120,
    particleSpeed: 0.5,
    particleSize: { min: 1, max: 3 },
  },
  desktop: {
    particleCount: 60,
    connectionDistance: 150,
    particleSpeed: 0.5,
    particleSize: { min: 1, max: 3 },
  },
};

// Animation and timing
export const TIMING = {
  debounceDelay: 150,
  animationDuration: 300,
  scrollThreshold: 50,
  copyFeedbackDuration: 2000,
  errorRetryDelay: 3000,
} as const;

// Pagination
export const PAGINATION = {
  galleryItemsPerPage: 12,
  projectsPerPage: 3,
  blogsPerPage: 3,
  maxVisiblePages: 5,
} as const;

// DOM Selectors
export const SELECTORS = {
  // Theme
  themeToggle: '#theme-toggle',

  // Navigation
  nav: '.nav',
  navToggle: '.nav-toggle',
  navLinks: '.nav-links',

  // Hero
  heroCanvas: '#hero-canvas',

  // Content containers
  featuredProjects: '#featured-projects',
  latestBlogs: '#latest-blogs',
  galleryPreview: '#gallery-preview',

  // Gallery
  galleryGrid: '#gallery-grid',
  pagination: '#pagination',
  lightbox: '#lightbox',
  lightboxImage: '#lightbox-image',
  lightboxCaption: '#lightbox-caption',
  lightboxClose: '#lightbox-close',
  lightboxPrev: '#lightbox-prev',
  lightboxNext: '#lightbox-next',
  shareButtons: '#share-buttons',
  filterButtons: '.filter-btn',
  viewButtons: '.view-btn',

  // Animations
  fadeElements: '.section-header, .card, .profile-container, .hero-text',
} as const;

// CSS Classes
export const CLASSES = {
  active: 'active',
  visible: 'visible',
  scrolled: 'scrolled',
  fadeInSection: 'fade-in-section',
  masonryView: 'masonry-view',
  disabled: 'disabled',
} as const;

// Data attributes
export const DATA_ATTRS = {
  theme: 'data-theme',
  filter: 'data-filter',
  view: 'data-view',
  page: 'data-page',
  index: 'data-index',
  href: 'data-href',
  id: 'data-id',
  category: 'data-category',
} as const;

// API endpoints (relative paths)
export const API = {
  contentIndex: '/content-index.json',
  galleryData: '/gallery-data.json',
} as const;

// Local storage keys
export const STORAGE_KEYS = {
  theme: 'theme',
} as const;

// Colors (for canvas)
export const COLORS = {
  light: {
    particle: 'rgba(0, 113, 227, 0.5)',
    connection: 'rgba(0, 113, 227, 0.1)',
  },
  dark: {
    particle: 'rgba(255, 255, 255, 0.5)',
    connection: 'rgba(255, 255, 255, 0.1)',
  },
} as const;

// Z-index scale
export const Z_INDEX = {
  dropdown: 100,
  sticky: 200,
  fixed: 500,
  modalBackdrop: 1000,
  modal: 1001,
  lightbox: 10000,
} as const;
