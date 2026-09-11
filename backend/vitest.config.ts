import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: [
        'src/server.ts',
        'src/models/**',
        'src/infra/openstates/openStates.types.ts',
      ],
      reporter: ['text', 'text-summary', 'html'],
    },
  },
});
