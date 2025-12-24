/**
 * Dynamic content loading module
 */

import type { ContentIndex, Project, BlogPost, GalleryItem } from '../types';
import { API, SELECTORS, PAGINATION } from './constants';
import { fetchJSON, getElement, formatDate, stripHtml } from './utils';

/**
 * Render a project card
 */
function renderProjectCard(project: Project): string {
  const tagsHtml = project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('');

  return `
    <article class="card" data-href="${project.link}" tabindex="0" role="link">
      <div class="card-image-placeholder">
        <img
          src="${project.image}"
          class="card-image"
          alt="${stripHtml(project.title)}"
          loading="lazy"
          onerror="this.src='/images/placeholder.png'"
        >
      </div>
      <div class="card-body">
        <h3><a href="${project.link}">${project.title}</a></h3>
        <p>${project.description}</p>
        <div class="tags">${tagsHtml}</div>
      </div>
    </article>
  `;
}

/**
 * Render a blog card
 */
function renderBlogCard(blog: BlogPost): string {
  const formattedDate = formatDate(blog.date);
  const tagsHtml = blog.tags
    .slice(0, 3)
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join('');

  return `
    <article class="card" data-href="/${blog.link}" tabindex="0" role="link">
      <div class="card-image-placeholder">
        <img
          src="${blog.image}"
          alt="${stripHtml(blog.title)}"
          loading="lazy"
          onerror="this.src='/images/placeholder.png'"
        >
      </div>
      <div class="card-body">
        <p class="blog-meta">${formattedDate} · ${blog.readTime}</p>
        <h3><a href="/${blog.link}">${blog.title}</a></h3>
        <p>${blog.description}</p>
        <div class="tags">${tagsHtml}</div>
      </div>
    </article>
  `;
}

/**
 * Render a gallery preview card
 */
function renderGalleryPreviewCard(item: GalleryItem): string {
  return `
    <article class="card" data-href="/gallery.html" tabindex="0" role="link">
      <div class="card-image-placeholder">
        <img
          src="${item.image}"
          class="card-image"
          alt="${stripHtml(item.caption)}"
          loading="lazy"
          onerror="this.src='/images/placeholder.png'"
        >
      </div>
      <div class="card-body">
        <div class="tags">
          <span class="tag">${item.category}</span>
        </div>
        <p>${item.caption}</p>
      </div>
    </article>
  `;
}

/**
 * Show error message in container
 */
function showError(container: Element, message: string): void {
  container.innerHTML = `<p class="error-message">${message}</p>`;
}

/**
 * Load featured projects
 */
export async function loadFeaturedProjects(projects?: Project[]): Promise<void> {
  const container = getElement(SELECTORS.featuredProjects);
  if (!container) return;

  try {
    let projectList = projects;

    if (!projectList) {
      const data = await fetchJSON<ContentIndex>(API.contentIndex);
      projectList = data.projects;
    }

    // Sort by date (newest first) and get top N
    const sortedProjects = [...projectList]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, PAGINATION.projectsPerPage);

    container.innerHTML = sortedProjects.map(renderProjectCard).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
    showError(container, 'Unable to load projects at this time.');
  }
}

/**
 * Load latest blog posts
 */
export async function loadLatestBlogs(blogs?: BlogPost[]): Promise<void> {
  const container = getElement(SELECTORS.latestBlogs);
  if (!container) return;

  try {
    let blogList = blogs;

    if (!blogList) {
      const data = await fetchJSON<ContentIndex>(API.contentIndex);
      blogList = data.blogs;
    }

    // Sort by date (newest first) and get top N
    const sortedBlogs = [...blogList]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, PAGINATION.blogsPerPage);

    container.innerHTML = sortedBlogs.map(renderBlogCard).join('');
  } catch (error) {
    console.error('Error loading blogs:', error);
    showError(container, 'Unable to load blog posts at this time.');
  }
}

/**
 * Load gallery preview
 */
export async function loadGalleryPreview(): Promise<void> {
  const container = getElement(SELECTORS.galleryPreview);
  if (!container) return;

  try {
    const data = await fetchJSON<GalleryItem[]>(API.galleryData);

    // Get first 3 items
    const previewItems = data.slice(0, 3);

    container.innerHTML = previewItems.map(renderGalleryPreviewCard).join('');
  } catch (error) {
    console.error('Error loading gallery preview:', error);
    showError(container, 'Unable to load gallery at this time.');
  }
}

/**
 * Load all dynamic content
 */
export async function loadDynamicContent(): Promise<void> {
  try {
    const data = await fetchJSON<ContentIndex>(API.contentIndex);

    // Load in parallel
    await Promise.all([loadFeaturedProjects(data.projects), loadLatestBlogs(data.blogs)]);
  } catch (error) {
    console.error('Error loading content:', error);
    // Individual loaders will handle their own errors
    await Promise.all([loadFeaturedProjects(), loadLatestBlogs()]);
  }
}

/**
 * Initialize content loading based on page elements
 */
export function initContent(): void {
  const hasProjects = !!getElement(SELECTORS.featuredProjects);
  const hasBlogs = !!getElement(SELECTORS.latestBlogs);
  const hasGalleryPreview = !!getElement(SELECTORS.galleryPreview);

  if (hasProjects || hasBlogs) {
    loadDynamicContent();
  }

  if (hasGalleryPreview) {
    loadGalleryPreview();
  }
}
