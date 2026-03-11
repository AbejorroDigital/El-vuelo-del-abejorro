import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api/wp': {
          target: 'https://abejorro-digital.rf.gd',
          changeOrigin: true,
          rewrite: (path) => {
            // Convierte /api/wp/posts?_embed=1 a /el-vuelo-del-abejorro/index.php?rest_route=/wp/v2/posts&_embed=1
            const newPath = path.replace(/^\/api\/wp/, '/el-vuelo-del-abejorro/index.php?rest_route=/wp/v2');
            // Si hay un ? extra después de rest_route, lo cambiamos por &
            return newPath.replace(/\?rest_route=(.*?)\?/, '?rest_route=$1&');
          }
        }
      }
    },
  };
});
