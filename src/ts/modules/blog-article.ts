/**
 * Blog Article Module
 * Handles scroll animations, progress bar, back-to-top button, and counter animations
 */

import { debounce } from './utils';

/**
 * Initialize scroll animations for elements with .animate-on-scroll class
 */
export function initScrollAnimations(): void {
  const observerOptions: IntersectionObserverInit = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Initialize progress bar that shows reading progress
 */
export function initProgressBar(): void {
  const progressBar = document.querySelector<HTMLElement>('.progress-bar');
  if (!progressBar) return;

  const updateProgress = debounce(() => {
    const scrollPos = window.scrollY;
    const windowHeight =
      document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = (scrollPos / windowHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  }, 10);

  window.addEventListener('scroll', updateProgress, { passive: true });
}

/**
 * Initialize back-to-top button
 */
export function initBackToTop(): void {
  const backToTopBtn = document.getElementById('backToTop');
  if (!backToTopBtn) return;

  const toggleVisibility = debounce(() => {
    if (window.scrollY > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
  }, 50);

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  });
}

/**
 * Animate counter elements when they come into view
 */
export function initCounterAnimations(): void {
  const counters = document.querySelectorAll<HTMLElement>('.counter');
  if (counters.length === 0) return;

  const animateCounter = (element: HTMLElement, target: number, duration = 2000): void => {
    let start = 0;
    const increment = target / (duration / 16);

    const counter = setInterval(() => {
      start += increment;
      if (start >= target) {
        element.textContent = target.toString();
        clearInterval(counter);
      } else {
        element.textContent = Math.floor(start).toString();
      }
    }, 16);
  };

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.getAttribute('data-animated')) {
          entry.target.setAttribute('data-animated', 'true');
          const target = parseInt(entry.target.getAttribute('data-target') || '0', 10);
          animateCounter(entry.target as HTMLElement, target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => {
    counterObserver.observe(el);
  });
}

/**
 * Calculate and display reading time
 */
export function calculateReadTime(): void {
  const readTimeEl = document.querySelector<HTMLElement>('.read-time');
  if (!readTimeEl) return;

  const articleContent = document.querySelector('.blog-article');
  if (!articleContent) return;

  const text = articleContent.textContent || '';
  const wordsPerMinute = 200;
  const words = text.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  readTimeEl.textContent = minutes.toString();
}

/**
 * Initialize hashtag copy functionality
 */
export function initHashtagCopy(): void {
  document.querySelectorAll('.hashtags span').forEach((tag) => {
    tag.addEventListener('click', async function (this: HTMLElement) {
      const text = this.textContent || '';

      try {
        await navigator.clipboard.writeText(text);
        const originalText = this.textContent;
        this.textContent = 'Copied!';
        setTimeout(() => {
          this.textContent = originalText;
        }, 1500);
      } catch {
        // Fallback for browsers without clipboard API
        console.log('Clipboard API not available');
      }
    });
  });
}

/**
 * Initialize smooth scroll for anchor links
 */
export function initSmoothScroll(): void {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (this: HTMLAnchorElement, e: Event) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (!targetId) return;

      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

/**
 * Initialize keyboard shortcuts
 */
export function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    // Press 'T' to go to top
    if (e.key === 't' || e.key === 'T') {
      // Only if not in an input field
      if (document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      }
    }
  });
}

/**
 * Initialize all blog article features
 */
export function initBlogArticle(): void {
  initScrollAnimations();
  initProgressBar();
  initBackToTop();
  initCounterAnimations();
  calculateReadTime();
  initHashtagCopy();
  initSmoothScroll();
  initKeyboardShortcuts();
}
