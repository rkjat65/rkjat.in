import { fetchJSON, formatDate, stripHtml } from './utils';
import type { ContentIndex } from '../types';

async function loadAllBlogs(): Promise<void> {
  const container = document.getElementById('blog-posts');
  if (!container) return;

  try {
    const data = await fetchJSON<ContentIndex>('/content-index.json');
    const blogs = data.blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    container.innerHTML = blogs.map(blog => {
      const formattedDate = formatDate(blog.date);
      const tagsHtml = blog.tags.slice(0, 3).map(tag => `<span class="tag">${tag}</span>`).join('');

      return `
        <article class="card" data-href="/${blog.link}" tabindex="0" role="link">
          <div class="card-image-placeholder">
            <img src="${blog.image}" alt="${stripHtml(blog.title)}" loading="lazy" onerror="this.src='/images/placeholder.png'">
          </div>
          <div class="card-body">
            <p class="blog-meta">${formattedDate} · ${blog.readTime}</p>
            <h3><a href="/${blog.link}">${blog.title}</a></h3>
            <p>${blog.description}</p>
            <div class="tags">${tagsHtml}</div>
          </div>
        </article>
      `;
    }).join('');

    // Add click handlers for cards
    container.querySelectorAll<HTMLElement>('.card[data-href]').forEach(card => {
      card.addEventListener('click', () => {
        const href = card.dataset.href;
        if (href) window.location.href = href;
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const href = card.dataset.href;
          if (href) window.location.href = href;
        }
      });
    });
  } catch (error) {
    console.error('Error loading blogs:', error);
    container.innerHTML = '<p class="error-message">Unable to load blog posts at this time.</p>';
  }
}

export function initBlogPage(): void {
  if (document.getElementById('blog-posts')) {
    void loadAllBlogs();
  }
}
