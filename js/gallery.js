// ============================================
// Gallery Page JavaScript
// ============================================

class Gallery {
  constructor() {
    this.galleryData = [];
    this.currentFilter = 'all';
    this.currentView = 'grid';
    this.currentImageIndex = 0;
    this.currentPage = 1;
    this.itemsPerPage = 12;

    this.init();
  }

  async init() {
    await this.loadGalleryData();
    this.setupEventListeners();
    this.renderGallery();
    this.renderPagination();
  }

  async loadGalleryData() {
    try {
      const response = await fetch('/gallery-data.json');
      this.galleryData = await response.json();
    } catch (error) {
      console.error('Error loading gallery data:', error);
      // Fallback sample data
      this.galleryData = this.getSampleData();
    }
  }

  getSampleData() {
    return [
      {
        id: 1,
        image: '/images/gallery/sample1.png',
        category: 'economics',
        caption: 'Economic growth trends analysis showing positive trajectory'
      },
      {
        id: 2,
        image: '/images/gallery/sample2.png',
        category: 'politics',
        caption: 'Political landscape visualization across regions'
      },
      {
        id: 3,
        image: '/images/gallery/sample3.png',
        category: 'social',
        caption: 'Social indicators breakdown by demographics'
      }
    ];
  }

  setupEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleFilterClick(e));
    });

    // View toggle buttons
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleViewToggle(e));
    });

    // Lightbox controls
    document.getElementById('lightbox-close').addEventListener('click', () => this.closeLightbox());
    document.getElementById('lightbox-prev').addEventListener('click', () => this.navigateLightbox(-1));
    document.getElementById('lightbox-next').addEventListener('click', () => this.navigateLightbox(1));

    // Close lightbox on background click
    document.getElementById('lightbox').addEventListener('click', (e) => {
      if (e.target.id === 'lightbox') {
        this.closeLightbox();
      }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  getFilteredData() {
    return this.currentFilter === 'all'
      ? this.galleryData
      : this.galleryData.filter(item => item.category === this.currentFilter);
  }

  getPaginatedData() {
    const filtered = this.getFilteredData();
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return filtered.slice(start, end);
  }

  renderGallery() {
    const grid = document.getElementById('gallery-grid');
    const paginatedData = this.getPaginatedData();

    if (paginatedData.length === 0) {
      grid.innerHTML = '<div class="loading-placeholder">No images found in this category</div>';
      return;
    }

    grid.innerHTML = paginatedData.map((item, index) => {
      const caption = item.caption || '';
      const globalIndex = (this.currentPage - 1) * this.itemsPerPage + index;

      return `
        <div class="gallery-item" data-id="${item.id}" data-index="${globalIndex}" data-category="${item.category}">
          <img src="${item.image}" alt="${caption}" class="gallery-item-image" loading="lazy">
          <div class="gallery-item-info">
            <div class="gallery-item-category">${item.category}</div>
            <div class="gallery-item-caption">${caption}</div>
          </div>
        </div>
      `;
    }).join('');

    // Add click listeners to gallery items
    document.querySelectorAll('.gallery-item').forEach(item => {
      item.addEventListener('click', () => {
        const index = parseInt(item.dataset.index);
        this.openLightbox(index);
      });
    });

    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderPagination() {
    const pagination = document.getElementById('pagination');
    const filtered = this.getFilteredData();
    const totalPages = Math.ceil(filtered.length / this.itemsPerPage);

    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    let paginationHTML = '';

    // Previous button
    paginationHTML += `
      <button class="pagination-btn ${this.currentPage === 1 ? 'disabled' : ''}"
              data-page="${this.currentPage - 1}"
              ${this.currentPage === 1 ? 'disabled' : ''}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
        Previous
      </button>
    `;

    // Page numbers
    const maxVisible = 5;
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
      if (startPage > 2) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `
        <button class="pagination-btn ${i === this.currentPage ? 'active' : ''}"
                data-page="${i}">
          ${i}
        </button>
      `;
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        paginationHTML += `<span class="pagination-ellipsis">...</span>`;
      }
      paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
    }

    // Next button
    paginationHTML += `
      <button class="pagination-btn ${this.currentPage === totalPages ? 'disabled' : ''}"
              data-page="${this.currentPage + 1}"
              ${this.currentPage === totalPages ? 'disabled' : ''}>
        Next
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    `;

    pagination.innerHTML = paginationHTML;

    // Add click listeners to pagination buttons
    document.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const page = parseInt(e.currentTarget.dataset.page);
        if (page && page !== this.currentPage) {
          this.currentPage = page;
          this.renderGallery();
          this.renderPagination();
        }
      });
    });
  }

  handleFilterClick(e) {
    const btn = e.currentTarget;
    const filter = btn.dataset.filter;

    // Update active state
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    this.currentFilter = filter;
    this.currentPage = 1; // Reset to first page
    this.renderGallery();
    this.renderPagination();
  }

  handleViewToggle(e) {
    const btn = e.currentTarget;
    const view = btn.dataset.view;

    // Update active state
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const grid = document.getElementById('gallery-grid');
    if (view === 'masonry') {
      grid.classList.add('masonry-view');
    } else {
      grid.classList.remove('masonry-view');
    }

    this.currentView = view;
  }

  openLightbox(index) {
    const filtered = this.getFilteredData();
    const item = filtered[index];

    if (!item) return;

    this.currentImageIndex = index;

    const lightbox = document.getElementById('lightbox');
    const image = document.getElementById('lightbox-image');
    const captionDiv = document.getElementById('lightbox-caption');

    image.src = item.image;
    image.alt = item.caption || '';

    // Display caption (read-only)
    captionDiv.innerHTML = item.caption || '<em style="opacity: 0.6;">No caption available</em>';

    // Generate share buttons
    this.generateShareButtons(item);

    // Update navigation buttons
    document.getElementById('lightbox-prev').disabled = index === 0;
    document.getElementById('lightbox-next').disabled = index === filtered.length - 1;

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  generateShareButtons(item) {
    const shareButtons = document.getElementById('share-buttons');
    const pageUrl = window.location.origin + window.location.pathname;
    const imageUrl = window.location.origin + item.image;
    const text = item.caption || 'Check out this data visualization';
    const hashtags = 'DataVisualization,Analytics,DAwithRK';

    shareButtons.innerHTML = `
      <button class="share-btn twitter" onclick="window.open('https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(text)}&hashtags=${hashtags}', '_blank', 'width=550,height=420')">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        Twitter
      </button>

      <button class="share-btn linkedin" onclick="window.open('https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}', '_blank', 'width=550,height=420')">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </button>

      <button class="share-btn facebook" onclick="window.open('https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}', '_blank', 'width=550,height=420')">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
        Facebook
      </button>

      <button class="share-btn whatsapp" onclick="window.open('https://wa.me/?text=${encodeURIComponent(text + ' ' + pageUrl)}', '_blank')">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
        WhatsApp
      </button>

      <button class="share-btn copy" onclick="navigator.clipboard.writeText('${pageUrl}').then(() => { this.textContent = 'Copied!'; setTimeout(() => this.innerHTML = '<svg viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\'><rect x=\\'9\\' y=\\'9\\' width=\\'13\\' height=\\'13\\' rx=\\'2\\' ry=\\'2\\'></rect><path d=\\'M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1\\'></path></svg>Copy Link', 2000); })">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        Copy Link
      </button>
    `;
  }

  closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
    document.body.style.overflow = '';
  }

  navigateLightbox(direction) {
    const filtered = this.getFilteredData();
    const newIndex = this.currentImageIndex + direction;

    if (newIndex >= 0 && newIndex < filtered.length) {
      this.openLightbox(newIndex);
    }
  }

  handleKeyboard(e) {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;

    switch(e.key) {
      case 'Escape':
        this.closeLightbox();
        break;
      case 'ArrowLeft':
        this.navigateLightbox(-1);
        break;
      case 'ArrowRight':
        this.navigateLightbox(1);
        break;
    }
  }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Gallery();
});
