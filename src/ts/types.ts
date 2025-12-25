/**
 * Type definitions for DAwithRK website
 */

// Content types from JSON files
export interface Project {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image: string;
  link: string;
  featured?: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
  image: string;
  link: string;
}

export interface GalleryItem {
  id: number;
  image: string;
  category: string;
  caption: string;
}

export interface ContentIndex {
  projects: Project[];
  blogs: BlogPost[];
  metadata: {
    lastUpdated: string;
    version: string;
  };
}

// Theme types
export type Theme = 'light' | 'dark';

// Gallery types
export type GalleryFilter = 'all' | string;
export type GalleryView = 'grid' | 'masonry';

export interface GalleryState {
  data: GalleryItem[];
  currentFilter: GalleryFilter;
  currentView: GalleryView;
  currentPage: number;
  currentImageIndex: number;
  itemsPerPage: number;
}

// Particle system types
export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
}

export interface ParticleConfig {
  particleCount: number;
  connectionDistance: number;
  particleSpeed: number;
  particleSize: { min: number; max: number };
}

// Error types
export class ContentError extends Error {
  resource: string;
  originalError: Error | null;

  constructor(message: string, resource: string, originalError?: Error) {
    super(message);
    this.name = 'ContentError';
    this.resource = resource;
    this.originalError = originalError ?? null;
  }
}

// DOM element types for strict null checks
export type NullableElement<T extends Element = Element> = T | null;
