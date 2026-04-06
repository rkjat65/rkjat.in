import { defineConfig } from 'vite';
import { resolve } from 'path';
import handlebars from 'vite-plugin-handlebars';

export default defineConfig({
  root: 'src',
  base: '/',
  publicDir: '../public',

  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        about: resolve(__dirname, 'src/about.html'),
        projects: resolve(__dirname, 'src/projects/index.html'),
        notFound: resolve(__dirname, 'src/404.html'),
        gallery: resolve(__dirname, 'src/gallery.html'),
        contact: resolve(__dirname, 'src/contact.html'),
        portfolio: resolve(__dirname, 'src/portfolio/index.html'),
      },
    },
    cssCodeSplit: true,
    sourcemap: true,
    minify: 'esbuild',
  },

  plugins: [
    handlebars({
      partialDirectory: resolve(__dirname, 'src/components'),
      context: {
        year: new Date().getFullYear(),
        siteName: 'DAwithRK',
        siteUrl: 'https://rkjat.in',
        analyticsId: 'G-4V7XW1QPZ8',
      },
    }),
  ],

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@modules': resolve(__dirname, 'src/ts/modules'),
      '@css': resolve(__dirname, 'src/css'),
      '@components': resolve(__dirname, 'src/components'),
    },
  },

  server: {
    port: 3000,
    open: true,
    cors: true,
  },

  preview: {
    port: 4173,
    open: true,
  },

  css: {
    devSourcemap: true,
  },
});
