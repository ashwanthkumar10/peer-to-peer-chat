import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      crypto: path.resolve("node_modules/crypto-browserify"),
      stream: path.resolve("node_modules/stream-browserify"),
      buffer: path.resolve("node_modules/buffer"),
      process: path.resolve("node_modules/process/browser"),
    },
  },
  define: {
    global: "window", // Define `global` for browser compatibility
  },
});

