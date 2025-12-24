/**
 * Canvas particle animation module
 * Optimized with spatial hashing for O(n) performance instead of O(n²)
 */

import type { Particle, ParticleConfig } from '../types';
import { SELECTORS, PARTICLE_CONFIG, COLORS, BREAKPOINTS } from './constants';
import { getElement, prefersReducedMotion, isMobile, debounce } from './utils';
import { isDarkTheme } from './theme';

/**
 * Spatial hash grid for efficient particle neighbor lookups
 */
class SpatialHash {
  private cellSize: number;
  private grid: Map<string, Particle[]>;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
    this.grid = new Map();
  }

  clear(): void {
    this.grid.clear();
  }

  private getCellKey(x: number, y: number): string {
    const cellX = Math.floor(x / this.cellSize);
    const cellY = Math.floor(y / this.cellSize);
    return `${cellX},${cellY}`;
  }

  insert(particle: Particle): void {
    const key = this.getCellKey(particle.x, particle.y);
    const cell = this.grid.get(key);

    if (cell) {
      cell.push(particle);
    } else {
      this.grid.set(key, [particle]);
    }
  }

  getNearby(particle: Particle): Particle[] {
    const nearby: Particle[] = [];
    const cellX = Math.floor(particle.x / this.cellSize);
    const cellY = Math.floor(particle.y / this.cellSize);

    // Check 3x3 grid of cells around the particle
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = `${cellX + dx},${cellY + dy}`;
        const cell = this.grid.get(key);
        if (cell) {
          nearby.push(...cell);
        }
      }
    }

    return nearby;
  }
}

/**
 * Particle system with optimized rendering
 */
export class ParticleSystem {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private config: ParticleConfig;
  private spatialHash: SpatialHash;
  private width = 0;
  private height = 0;
  private animationId: number | null = null;
  private isRunning = false;
  private connectionDistanceSq: number;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Could not get canvas 2D context');
    }

    this.ctx = ctx;
    this.config = isMobile(BREAKPOINTS.tablet) ? PARTICLE_CONFIG.mobile : PARTICLE_CONFIG.desktop;
    this.spatialHash = new SpatialHash(this.config.connectionDistance);
    this.connectionDistanceSq = this.config.connectionDistance ** 2;
  }

  /**
   * Initialize the particle system
   */
  init(): void {
    if (prefersReducedMotion()) {
      return;
    }

    this.resize();
    this.createParticles();
    this.setupEventListeners();
    this.start();
  }

  /**
   * Resize canvas to match window size
   */
  private resize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  /**
   * Create initial particles
   */
  private createParticles(): void {
    this.particles = [];
    const { particleCount, particleSize } = this.config;

    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        id: i,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * this.config.particleSpeed,
        vy: (Math.random() - 0.5) * this.config.particleSpeed,
        size: Math.random() * (particleSize.max - particleSize.min) + particleSize.min,
      });
    }
  }

  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    const handleResize = debounce(() => {
      this.resize();
      this.createParticles();
    }, 250);

    window.addEventListener('resize', handleResize);

    // Listen for theme changes to update colors
    document.addEventListener('themeChange', () => {
      // Colors will be updated in the next animation frame
    });

    // Handle visibility change to pause/resume animation
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.start();
      }
    });
  }

  /**
   * Update particle position
   */
  private updateParticle(particle: Particle): void {
    particle.x += particle.vx;
    particle.y += particle.vy;

    // Bounce off walls
    if (particle.x < 0 || particle.x > this.width) {
      particle.vx *= -1;
      particle.x = Math.max(0, Math.min(this.width, particle.x));
    }
    if (particle.y < 0 || particle.y > this.height) {
      particle.vy *= -1;
      particle.y = Math.max(0, Math.min(this.height, particle.y));
    }
  }

  /**
   * Draw a single particle
   */
  private drawParticle(particle: Particle, color: string): void {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }

  /**
   * Draw connection between two particles
   */
  private drawConnection(p1: Particle, p2: Particle, color: string): void {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  }

  /**
   * Main animation loop
   */
  private animate = (): void => {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Get current theme colors
    const colors = isDarkTheme() ? COLORS.dark : COLORS.light;

    // Update spatial hash
    this.spatialHash.clear();
    for (const particle of this.particles) {
      this.updateParticle(particle);
      this.spatialHash.insert(particle);
    }

    // Draw particles and connections
    for (const particle of this.particles) {
      this.drawParticle(particle, colors.particle);

      // Get nearby particles for connection drawing
      const nearby = this.spatialHash.getNearby(particle);

      for (const other of nearby) {
        // Only draw connection once per pair (higher id draws to lower id)
        if (other.id >= particle.id) continue;

        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < this.connectionDistanceSq) {
          this.drawConnection(particle, other, colors.connection);
        }
      }
    }

    this.animationId = requestAnimationFrame(this.animate);
  };

  /**
   * Start the animation
   */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.animate();
  }

  /**
   * Pause the animation
   */
  pause(): void {
    this.isRunning = false;
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  /**
   * Stop and cleanup
   */
  destroy(): void {
    this.pause();
    this.particles = [];
    this.spatialHash.clear();
  }
}

/**
 * Initialize canvas animation if element exists
 */
export function initCanvas(): ParticleSystem | null {
  const canvas = getElement<HTMLCanvasElement>(SELECTORS.heroCanvas);

  if (!canvas) {
    return null;
  }

  const particleSystem = new ParticleSystem(canvas);
  particleSystem.init();

  return particleSystem;
}
