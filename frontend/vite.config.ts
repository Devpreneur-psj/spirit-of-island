import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Code splitting을 위한 청크 크기 최적화
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['framer-motion'],
          'utils-vendor': ['axios', 'zustand'],
        },
      },
    },
    // 이미지 최적화 설정
    assetsInlineLimit: 4096, // 4KB 미만의 이미지는 인라인으로 처리
  },
  server: {
    port: 3000,
    host: true,
  },
})
