import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Libraries go in their own files so a site update doesn't make returning
// visitors download three.js / React again (their file names stay the same).
const THREE_LIBS = /node_modules\/(three|three-stdlib|@react-three|troika-|maath|camera-controls|@react-spring|@use-gesture|zustand|its-fine|suspend-react|meshline|stats|detect-gpu|glsl-noise|hls\.js|@monogrid|@mediapipe)/;
const REACT_LIBS = /node_modules\/(react|react-dom|scheduler|lucide-react)\//;

export default defineConfig(() => {
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), tailwindcss()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // three.js is ~800 kB on its own; it now loads after the page text.
        chunkSizeWarningLimit: 1100,
        rollupOptions: {
          output: {
            manualChunks(id) {
              // Small shared build helpers (lazy-load helper etc.) stay with React,
              // otherwise the first page load would have to fetch three.js for them.
              if (id.includes('vite/preload-helper') || id.includes('commonjsHelpers')) return 'react-vendor';
              if (THREE_LIBS.test(id)) return 'three-vendor';
              if (REACT_LIBS.test(id)) return 'react-vendor';
              return undefined;
            },
          },
        },
      },
    };
});
