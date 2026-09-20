import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import handlebars from 'vite-plugin-handlebars';
import catalog from './src/data/platforms.json';
import visuals from './src/data/visuals.json';

const platforms = catalog.map((item) => ({
  ...item,
  external: item.url.startsWith('https://'),
  cricketArt: item.id === 'cricket-wicket',
  features: item.features.map((feature, index) => ({ ...feature, number: index + 1 })),
}));
const pages = ['index.html', 'about.html', 'contact.html', 'gallery.html', '404.html', 'platforms/index.html', ...catalog.map((item) => item.path.slice(1))];

export default defineConfig({
  root: 'src', base: '/', publicDir: '../public',
  build: {
    outDir: '../dist', emptyOutDir: true, sourcemap: false,
    rollupOptions: { input: Object.fromEntries(pages.map((page) => [page.replace(/[^a-z0-9]/gi, '-'), resolve(__dirname, 'src', page)])) },
  },
  plugins: [handlebars({
    partialDirectory: resolve(__dirname, 'src/components'),
    context(pagePath) {
      const platform = platforms.find((item) => pagePath.endsWith(item.path));
      const path = platform?.path ?? pagePath.replace(/index\.html$/, '');
      const schema = platform
        ? { '@context': 'https://schema.org', '@type': 'WebPage', name: platform.name, description: platform.description, url: `https://rkjat.in${platform.path}`, about: { '@type': 'CreativeWork', name: platform.name, url: platform.url.startsWith('/') ? `https://rkjat.in${platform.url}` : platform.url }, isPartOf: { '@id': 'https://rkjat.in/#website' } }
        : { '@context': 'https://schema.org', '@graph': [{ '@type': 'WebSite', '@id': 'https://rkjat.in/#website', url: 'https://rkjat.in/', name: 'Radhakishan Jat', author: { '@id': 'https://rkjat.in/#person' } }, { '@type': 'Person', '@id': 'https://rkjat.in/#person', name: 'Radhakishan Jat', url: 'https://rkjat.in/', sameAs: ['https://github.com/rkjat65', 'https://linkedin.com/in/rkjat65', 'https://rkjat65.substack.com/'] }] };
      return {
        year: new Date().getFullYear(), analyticsId: 'G-4V7XW1QPZ8',
        canonicalPath: path, platforms, platform, platformCount: platforms.length,
        relatedPlatforms: platforms.filter((item) => item.id !== platform?.id).slice(0, 3),
        visuals, featuredVisuals: [visuals[0], visuals[11], visuals[7]],
        structuredData: `<script type="application/ld+json">${JSON.stringify(schema).replace(/</g, '\\u003c')}</script>`,
      };
    },
  })],
  resolve: { alias: { '@': resolve(__dirname, 'src'), '@modules': resolve(__dirname, 'src/ts/modules'), '@css': resolve(__dirname, 'src/css'), '@components': resolve(__dirname, 'src/components') } },
  server: { port: 3000, open: false }, preview: { port: 4173, open: false },
});
