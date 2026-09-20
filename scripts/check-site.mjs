import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { JSDOM } from 'jsdom';

const root = resolve('dist');
const catalog = JSON.parse(await readFile('src/data/platforms.json', 'utf8'));
const aliases = JSON.parse(await readFile('src/data/redirects.json', 'utf8'));
const pages = JSON.parse(await readFile('.temp/site-pages.json', 'utf8'));
const failures = [];
let checkedLinks = 0;
const assetCache = new Set();
const check = (condition, reason) => { if (!condition) failures.push(reason); };

for (const path of [...pages, '/404.html']) {
  const filename = resolve(root, '.' + (path.endsWith('/') ? path + 'index.html' : path));
  const html = await readFile(filename, 'utf8');
  const document = new JSDOM(html).window.document;
  check(document.querySelector('link[rel="canonical"]')?.getAttribute('href') === `https://rkjat.in${path}`, `${path}: canonical URL`);
  check(!!document.title && !/undefined|\{\{/.test(document.title), `${path}: title`);
  check(!!document.querySelector('meta[name="description"]')?.content, `${path}: description`);
  check(!!document.querySelector('meta[name="viewport"]'), `${path}: viewport`);
  if (document.querySelector('.site-header')) {
    check(document.querySelectorAll('h1').length === 1, `${path}: exactly one heading level 1`);
    check(document.querySelectorAll('main').length === 1, `${path}: main landmark`);
    const ids = Array.from(document.querySelectorAll('[id]')).map((element) => element.id);
    check(new Set(ids).size === ids.length, `${path}: duplicate IDs`);
    for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
      try { JSON.parse(script.textContent); } catch { failures.push(`${path}: invalid structured data`); }
    }
    check(!/\{\{/.test(html), `${path}: unresolved template`);
    check(!document.querySelector('canvas, iframe'), `${path}: no upfront canvas or iframe workload`);
    for (const image of document.images) {
      check(image.hasAttribute('alt') && image.hasAttribute('width') && image.hasAttribute('height'), `${path}: image accessibility and reserved size`);
    }
  }
  for (const element of document.querySelectorAll('[href], [src], [srcset]')) {
    const refs = [element.getAttribute('href'), element.getAttribute('src'), ...(element.getAttribute('srcset') ?? '').split(',').map((item) => item.trim().split(/\s+/)[0])].filter(Boolean);
    for (const ref of refs) {
      if (/^(https?:|mailto:|tel:|data:|javascript:|#)/i.test(ref)) continue;
      const pathname = decodeURI(ref.split(/[?#]/)[0]);
      if (!pathname) continue;
      let target = pathname.startsWith('/') ? resolve(root, '.' + pathname) : resolve(dirname(filename), pathname);
      if (pathname.endsWith('/')) target = resolve(target, 'index.html');
      if (assetCache.has(target)) continue;
      assetCache.add(target);
      try { await access(target); checkedLinks += 1; } catch { failures.push(`${path}: missing ${ref}`); }
    }
  }
}

for (const path of ['/', '/platforms/']) {
  const file = resolve(root, '.' + path, 'index.html');
  const doc = new JSDOM(await readFile(file, 'utf8')).window.document;
  const cards = [...doc.querySelectorAll('.platform-card')];
  check(cards.length === catalog.length, `${path}: every platform appears equally in the initial HTML`);
  for (const item of catalog) check(cards.some((card) => card.dataset.name === item.name && [...card.querySelectorAll('a')].some((a) => a.getAttribute('href') === item.url)), `${path}: missing ${item.name} or destination`);
}
for (const [path, target] of Object.entries(aliases)) {
  const file = resolve(root, '.' + (path.endsWith('/') ? path + 'index.html' : path));
  const html = await readFile(file, 'utf8');
  check(html.includes(`content="0;url=${target}"`), `${path}: preserved redirect`);
}
const sitemap = await readFile(resolve(root, 'sitemap.xml'), 'utf8');
check(!sitemap.includes('/404.html') && !sitemap.includes('/charts/'), 'Sitemap excludes error pages and chart embeds');
const assets = await readdir(resolve(root, 'assets'));
console.log(`Checked ${pages.length + 1} pages, ${checkedLinks} local resources, ${Object.keys(aliases).length} old-route redirects, and ${catalog.length} platforms in static HTML.`);
console.log('Production assets:', assets.filter((name) => /\.(css|js)$/.test(name)).join(', '));
if (failures.length) { console.error(failures.join('\n')); process.exitCode = 1; }
else console.log('All site checks passed.');
