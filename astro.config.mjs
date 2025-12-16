// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  // Habilita SSR para protección de rutas y endpoints dinámicos
  output: 'server',

  integrations: [react()],

  adapter: node({
    mode: 'standalone',
  }),
});