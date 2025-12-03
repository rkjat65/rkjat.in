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
});
