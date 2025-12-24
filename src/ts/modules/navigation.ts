/**
 * Navigation module
 */

import { SELECTORS, CLASSES, TIMING } from './constants';
import { getElement, getElements, throttle } from './utils';

/**
 * Initialize mobile navigation toggle
 */
export function initMobileNav(): void {
  const toggle = getElement<HTMLButtonElement>(SELECTORS.navToggle);
  const links = getElement(SELECTORS.navLinks);

  if (!toggle || !links) return;

  // Toggle menu on button click
  toggle.addEventListener('click', () => {
    const isActive = links.classList.toggle(CLASSES.active);
    toggle.setAttribute('aria-expanded', String(isActive));
  });

  // Close menu when clicking a link
  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove(CLASSES.active);
      toggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains(CLASSES.active)) {
      links.classList.remove(CLASSES.active);
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    const target = e.target as Node;
    if (
      links.classList.contains(CLASSES.active) &&
      !links.contains(target) &&
      !toggle.contains(target)
    ) {
      links.classList.remove(CLASSES.active);
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Set active navigation link based on current path
 */
export function setActiveNavLink(): void {
  const path = window.location.pathname;
  const links = getElements<HTMLAnchorElement>(`${SELECTORS.navLinks} a`);

  links.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Exact match for home, or starts with for other pages
    const isActive = path === href || (href !== '/' && path.startsWith(href));

    if (isActive) {
      link.classList.add(CLASSES.active);
      link.setAttribute('aria-current', 'page');
    } else {
      link.classList.remove(CLASSES.active);
      link.removeAttribute('aria-current');
    }
  });
}

/**
 * Initialize navbar scroll effect
 */
export function initNavScroll(): void {
  const nav = getElement(SELECTORS.nav);
  if (!nav) return;

  const handleScroll = throttle(() => {
    if (window.pageYOffset > TIMING.scrollThreshold) {
      nav.classList.add(CLASSES.scrolled);
    } else {
      nav.classList.remove(CLASSES.scrolled);
    }
  }, 100);

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Check initial scroll position
  handleScroll();
}

/**
 * Initialize scroll animations using Intersection Observer
 */
export function initScrollAnimations(): void {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add(CLASSES.visible);
          // Optionally unobserve after animation
          // observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  // Add fade-in class and observe elements
  getElements(SELECTORS.fadeElements).forEach((el) => {
    el.classList.add(CLASSES.fadeInSection);
    observer.observe(el);
  });
}

/**
 * Initialize card click navigation using event delegation
 */
export function initCardNavigation(): void {
  document.body.addEventListener('click', (e) => {
    const card = (e.target as Element).closest<HTMLElement>('.card[data-href]');

    if (card) {
      e.preventDefault();
      const href = card.dataset.href;
      if (href) {
        window.location.href = href;
      }
    }
  });

  // Add keyboard support for cards
  document.body.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return;

    const card = (e.target as Element).closest<HTMLElement>('.card[data-href]');
    if (card) {
      e.preventDefault();
      const href = card.dataset.href;
      if (href) {
        window.location.href = href;
      }
    }
  });
}

/**
 * Initialize all navigation features
 */
export function initNavigation(): void {
  initMobileNav();
  setActiveNavLink();
  initNavScroll();
  initScrollAnimations();
  initCardNavigation();
}
