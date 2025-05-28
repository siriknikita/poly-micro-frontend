import { defineConfig } from 'vitest/config.js';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    css: true,
    // Fix for the deprecation warning
    server: {
      deps: {
        inline: ['lucide-react'], // Add packages that should be inlined in tests
      },
    },
    typecheck: {
      enabled: true,
      tsconfig: './tsconfig.app.json',
    },
    // Suppress various test warnings
    onConsoleLog(log) {
      // Suppress React act() warnings
      if (
        (log.includes('Warning: An update to') &&
          log.includes('inside a test was not wrapped in act')) ||
        log.includes('data-testId')
      ) {
        return false;
      }

      // Suppress experimental feature warnings
      if (
        log.includes(
          'Testing types with tsc and vue-tsc is an experimental feature',
        ) ||
        log.includes('Breaking changes might not follow SemVer')
      ) {
        return false;
      }

      // Suppress guidance state logs
      if (log.includes('Current guidance state:')) {
        return false;
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/**',
        'src/__tests__/**',
        '**/*.d.ts',
        '**/index.ts',
        'coverage/**',
        '.github/**',
        'dev-scripts/**',
        'postcss.config.js',
        'tailwind.config.js',
        '**/*.config.{js,ts}',
        '**/emscripten_fetch_worker.js',
        'src/App.tsx',
        'src/main.tsx',
        'src/setupTests.ts',
        // Components not ready for coverage reporting
        'src/context/toastTypes.ts',
        'src/utils/**',
        'src/db/resetDatabase.ts',
        'src/db/seedReleases.ts',
        'src/hooks/useRelease.ts',
        'src/components/pipelining/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@shared': resolve(__dirname, './src/components/shared'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@types': resolve(__dirname, './src/types'),
      '@helpers': resolve(__dirname, './src/helpers'),
      '@constants': resolve(__dirname, './src/helpers/constants.tsx'),
      '@data': resolve(__dirname, './src/data'),
      '@tests': resolve(__dirname, './src/__tests__'),
    },
  },
});
