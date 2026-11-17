import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Lets the dev server preview inside a Replit workspace.
  server: { allowedHosts: ['.replit.dev', '.repl.co'] },
})
