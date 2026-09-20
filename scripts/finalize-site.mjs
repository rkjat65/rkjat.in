import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { resolve, relative, dirname, extname } from 'node:path';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = resolve('dist');
const catalog = JSON.parse(await readFile('src/data/platforms.json', 'utf8'));
const aliases = JSON.parse(await readFile('src/data/redirects.json', 'utf8'));
const research = {
  '/portfolio/tax-devolution/': ['India’s Fiscal Federalism — dashboard', 'Explore historical centre–state transfers, tax devolution, and state comparisons for FY 2020–21 to FY 2024–25.'],
  '/portfolio/indian-healthcare-analysis/': ['Indian Healthcare — analysis', 'Explore regional healthcare infrastructure, access, utilisation, and outcomes using historical public-health datasets.'],
  '/portfolio/indian-legislature-analysis/': ['Indian Legislature — analysis', 'Explore public declarations from the 2024 Lok Sabha election, including candidate education, assets, and criminal-case declarations.'],
  '/portfolio/indian-legislature-analysis/dashboard/': ['Indian Legislature — interactive dashboard', 'Interactive charts exploring the 2024 Lok Sabha candidate landscape.'],
  '/GyanGram/': ['GyanGram privacy policy', 'Privacy policy for GyanGram.'],
};
const pages = ['/', '/platforms/', '/about.html', '/contact.html', '/gallery.html', ...catalog.map((item) => item.path), ...Object.keys(research)];
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const imageMetadata = new Map();
const libraries = new Map();
let embeddedBytes = 0;
let lazyFrames = 0;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const lists = await Promise.all(entries.map((entry) => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)]));
  return lists.flat();
}

for (const file of (await walk(root)).filter((name) => name.endsWith('.html'))) {
  const path = '/' + relative(root, file).replaceAll('\\', '/');
  const canonical = path.replace(/index\.html$/, '');
  let html = await readFile(file, 'utf8');
  const isLegacy = !html.includes('class="site-header"') && !html.includes('http-equiv="refresh"');
  if (isLegacy) {
    // Plotly exports each include the same multi-megabyte library. Share it across
    // charts while preserving synchronous script order and the MIT license.
    html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (tag, attrs, body) => {
      if (!/^\s*\/\*\*[\s\S]{0,60}plotly\.js v/.test(body)) return tag;
      const digest = createHash('sha256').update(body).digest('hex').slice(0, 12);
      const name = `plotly-${digest}.js`;
      libraries.set(name, body);
      embeddedBytes += Buffer.byteLength(body);
      return `<script${attrs} src="/assets/vendor/${name}"></script>`;
    });
    const info = research[canonical];
    const title = info?.[0] ?? relative(root, file).split('/').at(-1).replace(/\.html$/, '').replaceAll('_', ' ') + ' — chart';
    const description = info?.[1] ?? 'An archived chart from Radhakishan Jat’s public-data analysis.';
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escape(title)} | Radhakishan Jat</title>`);
    if (!/<title>/i.test(html)) html = html.replace(/<head[^>]*>/i, `$&<title>${escape(title)} | Radhakishan Jat</title>`);
    const metadata = `${!info ? '<meta name="robots" content="noindex,follow">' : ''}<link rel="canonical" href="https://rkjat.in${canonical}"><meta name="description" content="${escape(description)}"><meta property="og:title" content="${escape(title)}"><meta property="og:description" content="${escape(description)}"><meta property="og:url" content="https://rkjat.in${canonical}"><meta property="og:type" content="website">`;
    // These retained pages are independent analytical interfaces, with their own CSS.
    html = html.replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi, '').replace(/<meta\b[^>]*(?:name=["'](?:description|robots)["']|property=["']og:[^"']+["'])[^>]*>/gi, '');
    html = html.replace(/<\/head>/i, `${metadata}</head>`);
    if (!/name=["']viewport["']/i.test(html)) html = html.replace(/<\/head>/i, '<meta name="viewport" content="width=device-width, initial-scale=1"></head>');
    if (!/<html[^>]*lang=/i.test(html)) html = html.replace(/<html/i, '<html lang="en"');
    html = html.replace(/<iframe\b([^>]*)>/gi, (tag, attrs) => {
      const name = attrs.match(/src="([^"]+)"/)?.[1]?.split('/').at(-1)?.replace('.html', '').replaceAll('_', ' ') ?? 'Interactive chart';
      lazyFrames += 1;
      return `<iframe${attrs}${/\bloading=/.test(attrs) ? '' : ' loading="lazy"'}${/\btitle=/.test(attrs) ? '' : ` title="${escape(name)}"`}>`;
    });
    for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
      const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
      if (!src || /^(https?:|data:)/.test(src)) continue;
      const asset = src.startsWith('/') ? resolve(root, src.slice(1)) : resolve(dirname(file), src);
      let updated = tag;
      if (!/\bloading=/.test(updated)) updated = updated.replace('<img', '<img loading="lazy" decoding="async"');
      if (!/\bwidth=/.test(updated) && ['.jpg', '.jpeg', '.png', '.webp'].includes(extname(asset).toLowerCase())) {
        if (!imageMetadata.has(asset)) imageMetadata.set(asset, await sharp(asset).metadata().catch(() => null));
        const dimensions = imageMetadata.get(asset);
        if (dimensions) updated = updated.replace('<img', `<img width="${dimensions.width}" height="${dimensions.height}"`);
      }
      html = html.replace(tag, updated);
    }
  }
  await writeFile(file, html);
}

await mkdir(resolve(root, 'assets/vendor'), { recursive: true });
for (const [name, body] of libraries) await writeFile(resolve(root, 'assets/vendor', name), body);
const uniqueBytes = [...libraries.values()].reduce((sum, text) => sum + Buffer.byteLength(text), 0);
console.log(`Shared ${libraries.size} Plotly libraries: ${((embeddedBytes - uniqueBytes) / 1024 / 1024).toFixed(1)} MiB of duplicate export code removed; ${lazyFrames} chart frames load lazily.`);

await writeFile(resolve(root, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((path) => `  <url><loc>https://rkjat.in${path}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(resolve(root, 'robots.txt'), 'User-agent: *\nAllow: /\n\nSitemap: https://rkjat.in/sitemap.xml\n');
await writeFile(resolve(root, '_redirects'), Object.entries(aliases).map(([from, to]) => `${from} ${to} 301`).join('\n') + '\n');
// Emit a compact page list for the independent output audit.
await mkdir('.temp', { recursive: true });
await writeFile('.temp/site-pages.json', JSON.stringify(pages));
for (const path of pages) {
  const name = path.endsWith('/') ? path + 'index.html' : path;
  await stat(resolve(root, '.' + name));
}
