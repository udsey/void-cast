import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, resolve(__dirname, '..'), 'VITE_')

  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_MAX_LINE_LENGTH': JSON.stringify(env.VITE_MAX_LINE_LENGTH),
      'import.meta.env.VITE_MAX_LINES': JSON.stringify(env.VITE_MAX_LINES),
      'import.meta.env.VITE_SHRINK_DURATION': JSON.stringify(env.VITE_SHRINK_DURATION),
      'import.meta.env.VITE_NEW_CAST_SIZE_MULT': JSON.stringify(env.VITE_NEW_CAST_SIZE_MULT),
      'import.meta.env.VITE_BASE_FONT_SIZE': JSON.stringify(env.VITE_BASE_FONT_SIZE),
      'import.meta.env.VITE_FONT_SIZE_VARIANCE': JSON.stringify(env.VITE_FONT_SIZE_VARIANCE),
      'import.meta.env.VITE_INITIAL_ZOOM': JSON.stringify(env.VITE_INITIAL_ZOOM),
      'import.meta.env.VITE_INPUT_PLACEHOLDER': JSON.stringify(env.VITE_INPUT_PLACEHOLDER),
      'import.meta.env.VITE_BUTTON_TEXT': JSON.stringify(env.VITE_BUTTON_TEXT),
      'import.meta.env.VITE_BUTTON_TEXT_OVER_LIMIT': JSON.stringify(env.VITE_BUTTON_TEXT_OVER_LIMIT),
      },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          ws: true,
        }
      }
    }
  }
})