/**
 * Gallery module with event delegation
 * Fixes memory leaks from the original implementation
 */

import type { GalleryItem, GalleryState, GalleryView } from '../types';
import { API, SELECTORS, CLASSES, PAGINATION } from './constants';
import { fetchJSON, getElement, stripHtml, copyToClipboard } from './utils';
import { shareOnTwitter, shareOnLinkedIn, shareOnFacebook, shareOnWhatsApp } from './share';

/**
 * Gallery class with proper event delegation
 */
export class Gallery {
  private state: GalleryState;
  private boundHandlers: Map<string, EventListener>;
  private isInitialized = false;

  constructor() {
    this.state = {
      data: [],
      currentFilter: 'all',
      currentView: 'grid',
      currentPage: 1,
      currentImageIndex: 0,
      itemsPerPage: PAGINATION.galleryItemsPerPage,
    };
    this.boundHandlers = new Map();
  }

  /**
   * Initialize the gallery
   */
  async init(): Promise<void> {
    if (this.isInitialized) return;

    await this.loadData();
    this.setupEventListeners();
    this.render();
    this.isInitialized = true;
  }

  /**
   * Load gallery data from JSON
   */
  private async loadData(): Promise<void> {
    try {
      this.state.data = await fetchJSON<GalleryItem[]>(API.galleryData);
    } catch (error) {
      console.error('Error loading gallery data:', error);
      this.state.data = this.getSampleData();
    }
  }

  /**
   * Get sample data as fallback
   */
  private getSampleData(): GalleryItem[] {
    return [
      {
        id: 1,
        image: '/images/gallery/sample1.png',
        category: 'economics',
        caption: 'Economic growth trends analysis',
      },
      {
        id: 2,
        image: '/images/gallery/sample2.png',
        category: 'politics',
        caption: 'Political landscape visualization',
      },
      {
        id: 3,
        image: '/images/gallery/sample3.png',
        category: 'social',
        caption: 'Social indicators breakdown',
      },
    ];
  }

  /**
   * Set up event listeners using event delegation
   */
  private setupEventListeners(): void {
    // Gallery grid click delegation
    const grid = getElement(SELECTORS.galleryGrid);
    if (grid && !this.boundHandlers.has('gridClick')) {
      const handler = this.handleGridClick.bind(this) as EventListener;
      this.boundHandlers.set('gridClick', handler);
      grid.addEventListener('click', handler);
    }

    // Pagination click delegation
    const pagination = getElement(SELECTORS.pagination);
    if (pagination && !this.boundHandlers.has('paginationClick')) {
      const handler = this.handlePaginationClick.bind(this) as EventListener;
      this.boundHandlers.set('paginationClick', handler);
      pagination.addEventListener('click', handler);
    }

    // Filter buttons delegation
    const filterContainer = document.querySelector('.gallery-filters');
    if (filterContainer && !this.boundHandlers.has('filterClick')) {
      const handler = this.handleFilterClick.bind(this) as EventListener;
      this.boundHandlers.set('filterClick', handler);
      filterContainer.addEventListener('click', handler);
    }

    // View toggle delegation
    const viewToggle = document.querySelector('.view-toggle');
    if (viewToggle && !this.boundHandlers.has('viewClick')) {
      const handler = this.handleViewToggle.bind(this) as EventListener;
      this.boundHandlers.set('viewClick', handler);
      viewToggle.addEventListener('click', handler);
    }

    // Lightbox controls
    this.setupLightboxListeners();

    // Keyboard navigation
    if (!this.boundHandlers.has('keyboard')) {
      const handler = this.handleKeyboard.bind(this) as EventListener;
      this.boundHandlers.set('keyboard', handler);
      document.addEventListener('keydown', handler);
    }
  }

  /**
   * Set up lightbox-specific listeners
   */
  private setupLightboxListeners(): void {
    const lightbox = getElement(SELECTORS.lightbox);
    if (!lightbox) return;

    // Close button
    const closeBtn = getElement(SELECTORS.lightboxClose);
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeLightbox());
    }

    // Previous button
    const prevBtn = getElement(SELECTORS.lightboxPrev);
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.navigate(-1));
    }

    // Next button
    const nextBtn = getElement(SELECTORS.lightboxNext);
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.navigate(1));
    }

    // Background click to close
    lightbox.addEventListener('click', (e) => {
      if ((e.target as Element).id === 'lightbox') {
        this.closeLightbox();
      }
    });

    // Share buttons delegation
    const shareContainer = getElement(SELECTORS.shareButtons);
    if (shareContainer && !this.boundHandlers.has('shareClick')) {
      const handler = this.handleShareClick.bind(this) as EventListener;
      this.boundHandlers.set('shareClick', handler);
      shareContainer.addEventListener('click', handler);
    }
  }

  /**
   * Handle grid item clicks
   */
  private handleGridClick(e: Event): void {
    const target = e.target as Element;
    const item = target.closest<HTMLElement>('.gallery-item');

    if (item) {
      const index = parseInt(item.dataset.index ?? '0', 10);
      this.openLightbox(index);
    }
  }

  /**
   * Handle pagination button clicks
   */
  private handlePaginationClick(e: Event): void {
    const target = e.target as Element;
    const btn = target.closest<HTMLButtonElement>('.pagination-btn');

    if (btn && !btn.disabled) {
      const page = parseInt(btn.dataset.page ?? '1', 10);
      if (page && page !== this.state.currentPage) {
        this.state.currentPage = page;
        this.render();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  /**
   * Handle filter button clicks
   */
  private handleFilterClick(e: Event): void {
    const target = e.target as Element;
    const btn = target.closest<HTMLButtonElement>('.filter-btn');

    if (btn) {
      const filter = btn.dataset.filter ?? 'all';

      // Update active state
      document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove(CLASSES.active));
      btn.classList.add(CLASSES.active);

      this.state.currentFilter = filter;
      this.state.currentPage = 1;
      this.render();
    }
  }

  /**
   * Handle view toggle clicks
   */
  private handleViewToggle(e: Event): void {
    const target = e.target as Element;
    const btn = target.closest<HTMLButtonElement>('.view-btn');

    if (btn) {
      const view = (btn.dataset.view ?? 'grid') as GalleryView;

      // Update active state
      document.querySelectorAll('.view-btn').forEach((b) => b.classList.remove(CLASSES.active));
      btn.classList.add(CLASSES.active);

      const grid = getElement(SELECTORS.galleryGrid);
      if (grid) {
        if (view === 'masonry') {
          grid.classList.add(CLASSES.masonryView);
        } else {
          grid.classList.remove(CLASSES.masonryView);
        }
      }

      this.state.currentView = view;
    }
  }

  /**
   * Handle share button clicks
   */
  private handleShareClick(e: Event): void {
    const target = e.target as Element;
    const btn = target.closest<HTMLButtonElement>('[data-share]');

    if (!btn) return;

    e.preventDefault();
    const shareType = btn.dataset.share;
    const item = this.getFilteredData()[this.state.currentImageIndex];

    if (!item) return;

    const options = {
      url: window.location.href,
      text: stripHtml(item.caption) || 'Check out this data visualization',
    };

    switch (shareType) {
      case 'twitter':
        shareOnTwitter(options);
        break;
      case 'linkedin':
        shareOnLinkedIn(options);
        break;
      case 'facebook':
        shareOnFacebook(options);
        break;
      case 'whatsapp':
        shareOnWhatsApp(options);
        break;
      case 'copy':
        void this.handleCopyLink(btn);
        break;
    }
  }

  /**
   * Handle copy link with feedback
   */
  private async handleCopyLink(button: HTMLButtonElement): Promise<void> {
    const success = await copyToClipboard(window.location.href);
    const originalHtml = button.innerHTML;

    button.innerHTML = success
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!'
      : 'Failed';

    setTimeout(() => {
      button.innerHTML = originalHtml;
    }, 2000);
  }

  /**
   * Handle keyboard navigation
   */
  private handleKeyboard(e: Event): void {
    const keyEvent = e as KeyboardEvent;
    const lightbox = getElement(SELECTORS.lightbox);

    if (!lightbox?.classList.contains(CLASSES.active)) return;

    switch (keyEvent.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.navigate(-1);
        break;
      case 'ArrowRight':
        this.navigate(1);
        break;
    }
  }

  /**
   * Get filtered data based on current filter
   */
  private getFilteredData(): GalleryItem[] {
    if (this.state.currentFilter === 'all') {
      return this.state.data;
    }
    return this.state.data.filter((item) => item.category === this.state.currentFilter);
  }

  /**
   * Get paginated data
   */
  private getPaginatedData(): GalleryItem[] {
    const filtered = this.getFilteredData();
    const start = (this.state.currentPage - 1) * this.state.itemsPerPage;
    const end = start + this.state.itemsPerPage;
    return filtered.slice(start, end);
  }

  /**
   * Render the gallery
   */
  render(): void {
    this.renderGallery();
    this.renderPagination();
  }

  /**
   * Render gallery items
   */
  private renderGallery(): void {
    const grid = getElement(SELECTORS.galleryGrid);
    if (!grid) return;

    const paginatedData = this.getPaginatedData();

    if (paginatedData.length === 0) {
      grid.innerHTML = '<div class="loading-placeholder">No images found in this category</div>';
      return;
    }

    grid.innerHTML = paginatedData
      .map((item, index) => {
        const globalIndex = (this.state.currentPage - 1) * this.state.itemsPerPage + index;
        const caption = stripHtml(item.caption);

        return `
        <div class="gallery-item"
             data-id="${item.id}"
             data-index="${globalIndex}"
             data-category="${item.category}"
             tabindex="0"
             role="button"
             aria-label="View ${caption}">
          <img src="${item.image}" alt="${caption}" class="gallery-item-image" loading="lazy">
          <div class="gallery-item-info">
            <div class="gallery-item-category">${item.category}</div>
            <div class="gallery-item-caption">${item.caption}</div>
          </div>
        </div>
      `;
      })
      .join('');
  }

  /**
   * Render pagination controls
   */
  private renderPagination(): void {
    const pagination = getElement(SELECTORS.pagination);
    if (!pagination) return;

    const filtered = this.getFilteredData();
    const totalPages = Math.ceil(filtered.length / this.state.itemsPerPage);

    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    const { currentPage } = this.state;
    const maxVisible = PAGINATION.maxVisiblePages;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    let html = `
      <button class="pagination-btn ${currentPage === 1 ? CLASSES.disabled : ''}"
              data-page="${currentPage - 1}"
              ${currentPage === 1 ? 'disabled' : ''}
              aria-label="Previous page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Previous
      </button>
    `;

    if (startPage > 1) {
      html += `<button class="pagination-btn" data-page="1">1</button>`;
      if (startPage > 2) {
        html += `<span class="pagination-ellipsis">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      html += `
        <button class="pagination-btn ${i === currentPage ? CLASSES.active : ''}"
                data-page="${i}"
                ${i === currentPage ? 'aria-current="page"' : ''}>
          ${i}
        </button>
      `;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        html += `<span class="pagination-ellipsis">...</span>`;
      }
      html += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    }

    html += `
      <button class="pagination-btn ${currentPage === totalPages ? CLASSES.disabled : ''}"
              data-page="${currentPage + 1}"
              ${currentPage === totalPages ? 'disabled' : ''}
              aria-label="Next page">
        Next
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;

    pagination.innerHTML = html;
  }

  /**
   * Open lightbox at specific index
   */
  openLightbox(index: number): void {
    const filtered = this.getFilteredData();
    const item = filtered[index];

    if (!item) return;

    this.state.currentImageIndex = index;

    const lightbox = getElement(SELECTORS.lightbox);
    const image = getElement<HTMLImageElement>(SELECTORS.lightboxImage);
    const caption = getElement(SELECTORS.lightboxCaption);
    const prevBtn = getElement<HTMLButtonElement>(SELECTORS.lightboxPrev);
    const nextBtn = getElement<HTMLButtonElement>(SELECTORS.lightboxNext);

    if (lightbox && image && caption) {
      image.src = item.image;
      image.alt = stripHtml(item.caption);
      caption.innerHTML = item.caption || '<em style="opacity: 0.6;">No caption available</em>';

      this.renderShareButtons(item);

      if (prevBtn) prevBtn.disabled = index === 0;
      if (nextBtn) nextBtn.disabled = index === filtered.length - 1;

      lightbox.classList.add(CLASSES.active);
      document.body.style.overflow = 'hidden';
    }
  }

  /**
   * Render share buttons for lightbox
   */
  private renderShareButtons(_item: GalleryItem): void {
    const container = getElement(SELECTORS.shareButtons);
    if (!container) return;

    container.innerHTML = `
      <button class="share-btn twitter" data-share="twitter" title="Share on Twitter">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        Twitter
      </button>
      <button class="share-btn linkedin" data-share="linkedin" title="Share on LinkedIn">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
        LinkedIn
      </button>
      <button class="share-btn facebook" data-share="facebook" title="Share on Facebook">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </button>
      <button class="share-btn whatsapp" data-share="whatsapp" title="Share on WhatsApp">
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
        WhatsApp
      </button>
      <button class="share-btn copy" data-share="copy" title="Copy link">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy Link
      </button>
    `;
  }

  /**
   * Close lightbox
   */
  closeLightbox(): void {
    const lightbox = getElement(SELECTORS.lightbox);
    if (lightbox) {
      lightbox.classList.remove(CLASSES.active);
      document.body.style.overflow = '';
    }
  }

  /**
   * Navigate lightbox
   */
  navigate(direction: number): void {
    const filtered = this.getFilteredData();
    const newIndex = this.state.currentImageIndex + direction;

    if (newIndex >= 0 && newIndex < filtered.length) {
      this.openLightbox(newIndex);
    }
  }

  /**
   * Cleanup and destroy the gallery
   */
  destroy(): void {
    // Remove all event listeners
    this.boundHandlers.forEach((handler, key) => {
      let element: Element | null = null;

      switch (key) {
        case 'gridClick':
          element = getElement(SELECTORS.galleryGrid);
          break;
        case 'paginationClick':
          element = getElement(SELECTORS.pagination);
          break;
        case 'filterClick':
          element = document.querySelector('.gallery-filters');
          break;
        case 'viewClick':
          element = document.querySelector('.view-toggle');
          break;
        case 'shareClick':
          element = getElement(SELECTORS.shareButtons);
          break;
        case 'keyboard':
          document.removeEventListener('keydown', handler);
          return;
      }

      element?.removeEventListener('click', handler);
    });

    this.boundHandlers.clear();
    this.isInitialized = false;
  }
}

/**
 * Initialize gallery on page
 */
export function initGallery(): Gallery | null {
  const grid = getElement(SELECTORS.galleryGrid);
  if (!grid) return null;

  const gallery = new Gallery();
  void gallery.init();

  return gallery;
}
