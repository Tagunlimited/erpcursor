import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  define: {
    __WS_TOKEN__: JSON.stringify(process.env.WS_TOKEN || ''),
    global: 'globalThis',
  },
  server: {
    host: "::",
    port: 8080,
    hmr: {
      port: 8080,
      clientPort: 8080,
    },
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    react({
      tsDecorators: true,
      devTarget: 'es2022',
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  esbuild: {
    target: 'es2022'
  },
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2022'
    }
  }
}));
