import { defineConfig } from 'vite';

// IMPORTANT: Change this to match your GitHub repository name
// If your repo is at github.com/username/porkroll, keep it as '/porkroll/'
// If your repo is at github.com/username/my-game, change to '/my-game/'
// For local development, this will be '/'
const REPO_NAME = 'porkroll';

// https://vite.dev/config/
export default defineConfig({
  // For GitHub Pages: use repo name as base path, for local dev use '/'
  base: process.env.GITHUB_PAGES ? `/${REPO_NAME}/` : '/',
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false // Disable sourcemaps for production
  },
  optimizeDeps: {
    include: ['three']
  }
});
