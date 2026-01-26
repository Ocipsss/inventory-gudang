import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Inventory Toko Mekkah',
        short_name: 'MekkahStock',
        theme_color: '#1e293b',
        icons: [
          {
            src: 'https://cdn-icons-png.flaticon.com/512/2331/2331970.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
})