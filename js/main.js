// ============================================
// DAwithRK - Simple Website JavaScript
// ============================================

// Theme Toggle
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  // Check saved preference
  const saved = localStorage.getItem('theme');
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (saved) {
    html.setAttribute('data-theme', saved);
  } else if (systemDark) {
    html.setAttribute('data-theme', 'dark');
  }
  
  updateThemeIcon();
  
  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const newTheme = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcon();
    });
  }
}

function updateThemeIcon() {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    toggle.textContent = isDark ? '☀️' : '🌙';
  }
}

// Mobile Navigation
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('active');
    });
    
    // Close on link click
    links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        links.classList.remove('active');
      });
    });
  }
}

// Active Nav Link
function setActiveNavLink() {
  const path = window.location.pathname;
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (path === href || (href !== '/' && path.startsWith(href))) {
      link.classList.add('active');
    }
  });
}

// Form Handler (for Netlify/Formspree)
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      
      if (response.ok) {
        form.innerHTML = `
          <div style="text-align: center; padding: 40px;">
            <p style="font-size: 3rem; margin-bottom: 16px;">✅</p>
            <h3>Message Sent!</h3>
            <p style="color: var(--text-secondary);">I'll get back to you soon.</p>
          </div>
        `;
      } else {
        throw new Error('Failed to send');
      }
    } catch (error) {
      btn.textContent = 'Error - Try Again';
      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
      }, 2000);
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileNav();
  setActiveNavLink();
  initContactForm();
  initShareButtons();
});

// ============================================
// Social Share Functions
// ============================================
function initShareButtons() {
  // Auto-generate share buttons if container exists
  const shareContainer = document.getElementById('share-buttons');
  if (shareContainer) {
    shareContainer.innerHTML = generateShareButtons();
  }
}

function generateShareButtons() {
  return `
    <a href="#" class="share-btn twitter" onclick="shareOnTwitter(); return false;" title="Share on Twitter">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
      Twitter
    </a>
    <a href="#" class="share-btn linkedin" onclick="shareOnLinkedIn(); return false;" title="Share on LinkedIn">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
      LinkedIn
    </a>
    <a href="#" class="share-btn facebook" onclick="shareOnFacebook(); return false;" title="Share on Facebook">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
      Facebook
    </a>
    <a href="#" class="share-btn whatsapp" onclick="shareOnWhatsApp(); return false;" title="Share on WhatsApp">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      WhatsApp
    </a>
    <button class="share-btn copy" onclick="copyLink()" title="Copy link">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
      <span id="copy-text">Copy Link</span>
    </button>
  `;
}

function shareOnTwitter() {
  const pageUrl = encodeURIComponent(window.location.href);
  const title = document.querySelector('h1')?.textContent || document.title;
  const text = encodeURIComponent(title);
  window.open('https://twitter.com/intent/tweet?url=' + pageUrl + '&text=' + text, '_blank', 'width=550,height=420');
}

function shareOnLinkedIn() {
  const pageUrl = encodeURIComponent(window.location.href);
  window.open('https://www.linkedin.com/sharing/share-offsite/?url=' + pageUrl, '_blank', 'width=550,height=420');
}

function shareOnFacebook() {
  const pageUrl = encodeURIComponent(window.location.href);
  window.open('https://www.facebook.com/sharer/sharer.php?u=' + pageUrl, '_blank', 'width=550,height=420');
}

function shareOnWhatsApp() {
  const title = document.querySelector('h1')?.textContent || document.title;
  const text = encodeURIComponent(title + ' - ' + window.location.href);
  window.open('https://wa.me/?text=' + text, '_blank');
}

function copyLink() {
  navigator.clipboard.writeText(window.location.href).then(function() {
    const btn = document.querySelector('.share-btn.copy');
    const text = document.getElementById('copy-text');
    if (btn && text) {
      btn.classList.add('copied');
      text.textContent = 'Copied!';
      setTimeout(function() {
        btn.classList.remove('copied');
        text.textContent = 'Copy Link';
      }, 2000);
    }
  });
}
