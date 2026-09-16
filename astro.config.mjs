import { defineConfig } from 'astro/config';
import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

export default defineConfig({
  site: 'https://eugenezalan.com',
  output: 'static',
  trailingSlash: 'never',
  devToolbar: { enabled: false },
  integrations: [{
    name: 'keep-source-media-local',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const output = fileURLToPath(dir);
        if (path.resolve(output) !== path.resolve('dist')) throw new Error('Unexpected build directory');
        // Keep downloaded originals in public; ship only the optimized media.
        for (const relative of ['images', 'videos/hero-original.mp4', 'videos/hero-mobile-original.mp4', 'videos/craft-original.mp4']) {
          const target = path.resolve(output, relative);
          if (!target.startsWith(path.resolve(output) + path.sep)) throw new Error('Invalid output path');
          await rm(target, { recursive: true, force: true });
        }
      },
    },
  }],
  server: { host: '127.0.0.1', port: 4321 },
  vite: { server: { strictPort: true } },
});
