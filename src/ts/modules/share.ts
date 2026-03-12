/**
 * Social sharing module
 */

import { TIMING } from './constants';
import { copyToClipboard, getElement } from './utils';

export interface ShareOptions {
  url?: string;
  text?: string;
  hashtags?: string[];
}

/**
 * Get default share options from current page
 */
function getDefaultShareOptions(): Required<ShareOptions> {
  return {
    url: window.location.href,
    text: document.title,
    hashtags: ['DataVisualization', 'Analytics', 'DAwithRK'],
  };
}

/**
 * Open a share popup window
 */
function openShareWindow(url: string, width = 550, height = 420): void {
  const left = (window.innerWidth - width) / 2 + window.screenX;
  const top = (window.innerHeight - height) / 2 + window.screenY;

  window.open(
    url,
    '_blank',
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
  );
}

/**
 * Share on Twitter/X
 */
export function shareOnTwitter(options: ShareOptions = {}): void {
  const { url, text, hashtags } = { ...getDefaultShareOptions(), ...options };

  const params = new URLSearchParams({
    url,
    text,
    hashtags: hashtags.join(','),
  });

  openShareWindow(`https://twitter.com/intent/tweet?${params.toString()}`);
}

/**
 * Share on LinkedIn
 */
export function shareOnLinkedIn(options: ShareOptions = {}): void {
  const { url } = { ...getDefaultShareOptions(), ...options };

  const params = new URLSearchParams({ url });

  openShareWindow(`https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`);
}

/**
 * Share on Facebook
 */
export function shareOnFacebook(options: ShareOptions = {}): void {
  const { url } = { ...getDefaultShareOptions(), ...options };

  const params = new URLSearchParams({ u: url });

  openShareWindow(`https://www.facebook.com/sharer/sharer.php?${params.toString()}`);
}

/**
 * Share on WhatsApp
 */
export function shareOnWhatsApp(options: ShareOptions = {}): void {
  const { url, text } = { ...getDefaultShareOptions(), ...options };

  const params = new URLSearchParams({
    text: `${text} ${url}`,
  });

  openShareWindow(`https://wa.me/?${params.toString()}`);
}

/**
 * Copy link to clipboard with visual feedback
 */
export async function copyLink(
  options: ShareOptions = {},
  feedbackElementId = 'copy-text'
): Promise<boolean> {
  const { url } = { ...getDefaultShareOptions(), ...options };

  const success = await copyToClipboard(url);
  const feedbackElement = getElement(`#${feedbackElementId}`);

  if (feedbackElement) {
    const originalText = feedbackElement.textContent ?? 'Copy Link';
    feedbackElement.textContent = success ? 'Copied!' : 'Failed';

    setTimeout(() => {
      feedbackElement.textContent = originalText;
    }, TIMING.copyFeedbackDuration);
  }

  return success;
}

/**
 * Generate share buttons HTML
 */
export function generateShareButtonsHTML(options: ShareOptions = {}): string {
  // Variables available for future use if needed
  const _opts = { ...getDefaultShareOptions(), ...options };
  void _opts; // Suppress unused warning

  return `
    <button class="share-btn twitter" data-share="twitter" title="Share on Twitter">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
      <span>Twitter</span>
    </button>
    <button class="share-btn linkedin" data-share="linkedin" title="Share on LinkedIn">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
      <span>LinkedIn</span>
    </button>
    <button class="share-btn facebook" data-share="facebook" title="Share on Facebook">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span>Facebook</span>
    </button>
    <button class="share-btn whatsapp" data-share="whatsapp" title="Share on WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
      <span>WhatsApp</span>
    </button>
    <button class="share-btn copy" data-share="copy" title="Copy link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <span id="copy-text">Copy Link</span>
    </button>
  `;
}

/**
 * Initialize share buttons with event delegation
 */
export function initShareButtons(containerSelector = '#share-buttons'): void {
  const container = getElement(containerSelector);
  if (!container) return;

  // Generate buttons if container is empty
  if (!container.innerHTML.trim()) {
    container.innerHTML = generateShareButtonsHTML();
  }

  // Use event delegation for all share buttons
  container.addEventListener('click', (e) => {
    const button = (e.target as Element).closest<HTMLButtonElement>('[data-share]');
    if (!button) return;

    e.preventDefault();
    const shareType = button.dataset.share;

    switch (shareType) {
      case 'twitter':
        shareOnTwitter();
        break;
      case 'linkedin':
        shareOnLinkedIn();
        break;
      case 'facebook':
        shareOnFacebook();
        break;
      case 'whatsapp':
        shareOnWhatsApp();
        break;
      case 'copy':
        void copyLink();
        break;
    }
  });
}
