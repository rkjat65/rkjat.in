// Shared helper for project page SEO + analytics
window.applyProjectMetadata = function (meta) {
  if (!meta || typeof document === 'undefined' || !document.head) return;

  const setTag = (selector, tagName, attrs) => {
    let node = selector ? document.head.querySelector(selector) : null;
    if (!node) {
      node = document.createElement(tagName);
      document.head.appendChild(node);
    }
    Object.keys(attrs).forEach((k) => node.setAttribute(k, attrs[k]));
    return node;
  };

  setTag('title', 'title', {});
  if (meta.title) {
    let titleEl = document.head.querySelector('title');
    if (!titleEl) { titleEl = document.createElement('title'); document.head.appendChild(titleEl); }
    titleEl.textContent = meta.title;
  }

  const addMeta = (name, content, useProperty) => {
    if (!content) return;
    const selector = useProperty
      ? `meta[property="${name}"]`
      : `meta[name="${name}"]`;
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      if (useProperty) el.setAttribute('property', name);
      else el.setAttribute('name', name);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  };

  const setLink = (rel, href) => {
    if (!href) return;
    let el = document.head.querySelector(`link[rel="${rel}"]`);
    if (!el) {
      el = document.createElement('link');
      el.setAttribute('rel', rel);
      document.head.appendChild(el);
    }
    el.setAttribute('href', href);
  };

  if (meta.description) addMeta('description', meta.description);
  if (meta.canonical) setLink('canonical', meta.canonical);
  if (meta.ogTitle) addMeta('og:title', meta.ogTitle, true);
  if (meta.ogDescription) addMeta('og:description', meta.ogDescription, true);
  if (meta.ogUrl) addMeta('og:url', meta.ogUrl, true);
  if (meta.ogType) addMeta('og:type', meta.ogType, true);
  if (meta.ogImage) addMeta('og:image', meta.ogImage, true);
  if (meta.twitterCard) addMeta('twitter:card', meta.twitterCard);
  if (meta.twitterTitle) addMeta('twitter:title', meta.twitterTitle);
  if (meta.twitterDescription) addMeta('twitter:description', meta.twitterDescription);

  if (meta.structuredData) {
    let scriptEl = document.head.querySelector('script[data-project-structured-data]');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.setAttribute('type', 'application/ld+json');
      scriptEl.setAttribute('data-project-structured-data', 'true');
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(meta.structuredData, null, 2);
  }

  if (meta.gaId) {
    if (!document.head.querySelector(`script[src*="gtag/js?id=${meta.gaId}"]`)) {
      const gaScript = document.createElement('script');
      gaScript.async = true;
      gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${meta.gaId}`;
      document.head.appendChild(gaScript);
    }
    if (!document.head.querySelector('script[data-gtag-init]')) {
      const inline = document.createElement('script');
      inline.setAttribute('data-gtag-init', 'true');
      inline.innerHTML = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);} gtag('js',new Date()); gtag('config','${meta.gaId}',{page_path:'${meta.pagePath || window.location.pathname}'});`;
      document.head.appendChild(inline);
    }
  }
};
