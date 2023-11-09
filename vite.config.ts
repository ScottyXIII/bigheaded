import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: './', // make index.html urls relative for deployment to GH pages
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
