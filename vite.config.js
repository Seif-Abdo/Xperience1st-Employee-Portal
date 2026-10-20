import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const chatbotUrl = env.VITE_CHATBOT_URL || 'http://localhost:5001'

  return {
    plugins: [
      react(),
      {
        name: 'html-transform',
        transformIndexHtml(html) {
          return html.replace(/%VITE_CHATBOT_URL%/g, chatbotUrl)
        }
      }
    ],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: chatbotUrl,
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})
