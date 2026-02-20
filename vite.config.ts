import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173,
  },
  plugins: [
    react(),
    {
      name: 'video-range-fix',
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (req.url?.match(/\.mp4(\?.*)?$/) && req.headers.range) {
            delete req.headers.range;
          }
          next();
        });
      },
    },
  ],
})
