import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    css: false, // Disable CSS processing in tests
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
      include: ['src/components/**/*'],
      exclude: [
        'node_modules/',
        'src/test/',
        'src/**/*.test.tsx',
        'src/**/*.test.ts',
        'src/**/*.spec.tsx',
        'src/**/*.spec.ts',
        '**/*.d.ts',
        '**/*.config.*',
        '**/types.ts',
        '**/mock-provider/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
