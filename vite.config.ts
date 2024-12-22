import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
//@ts-ignore
import cssInjector from 'vite-plugin-css-injected-by-js'

// https://vitejs.dev/config/
export default defineConfig({
  resolve:{
  },

  plugins: [preact(),
    cssInjector({
      // exclude: /node_modules/,
      // include: /\.css$/,
      // removeStyle: true,
      // injectType: 'styleTag',
      // insert: 'head',
      // generateScopedName: '[name]__[local]___[hash:base64:5]'
    })
    
  ],
  build:{
    rollupOptions:{
      output:{
        entryFileNames:'checkout.js'
      }
    },
    cssCodeSplit:false
  }
})
