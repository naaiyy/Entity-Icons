import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/core/index.ts',
  },
  format: ['esm'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  minify: false,
  external: ['react'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});

