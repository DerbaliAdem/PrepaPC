import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Node's `process`, typed here so the project does not need @types/node.
declare const process: { env: Record<string, string | undefined> };

export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
  build: { chunkSizeWarningLimit: 1500 },
});
