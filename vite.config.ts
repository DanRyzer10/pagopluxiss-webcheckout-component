import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
  build:{
    rollupOptions:{
      output:{
        entryFileNames:'iss-payment-button.js'
      }
    },
    cssCodeSplit:false
  }
})
