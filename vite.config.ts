import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed as a GitHub Pages *project* page at https://erbagnino.github.io/website/.
// If you ever move to a custom domain (root of the domain), change this to '/'
// and update public/404.html's pathSegmentsToKeep to 0, and public/CNAME.
export default defineConfig({
  base: '/website/',
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // three.js + react-three-fiber are the heaviest dependency by far;
          // isolating them keeps that weight in one cacheable, clearly-named
          // chunk instead of an arbitrarily-named shared chunk, and keeps it
          // separate from app code that changes far more often.
          'vendor-three': ['three', '@react-three/fiber'],
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion': ['framer-motion'],
        },
      },
    },
  },
})
