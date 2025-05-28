import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
// Determine if we're building for Tauri or for web
const isTauriBuild = process.env.TAURI_PLATFORM !== undefined;

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      // Externalize Tauri modules in web builds to prevent build errors
      external: isTauriBuild
        ? []
        : [
            '@tauri-apps/api',
            '@tauri-apps/api/os',
            '@tauri-apps/api/window',
            '@tauri-apps/api/path',
            '@tauri-apps/api/fs',
            '@tauri-apps/api/shell',
            '@tauri-apps/api/event',
          ],
    },
  },
  server: {
    port: 5174,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@shared': path.resolve(__dirname, './src/components/shared'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@types': path.resolve(__dirname, './src/types'),
      '@helpers': path.resolve(__dirname, './src/helpers'),
      '@constants': path.resolve(__dirname, './src/helpers/constants'),
      '@data': path.resolve(__dirname, './src/data'),
    },
  },
});
