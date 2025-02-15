import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Function to obfuscate environment variables
const obfuscateEnvVars = () => {
  const envVars = {
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
  };

  // Create obfuscated values
  const obfuscated = Object.entries(envVars).reduce((acc, [key, value]) => {
    if (value) {
      // Ensure URL has https:// prefix
      if (key === 'VITE_SUPABASE_URL' && value && !value.startsWith('https://')) {
        value = `https://${value}`;
      }
      // Split the value into chunks and reverse them
      const chunks = value.match(/.{1,4}/g) || [];
      const obfuscatedValue = chunks.reverse().join('');
      acc[`import.meta.env.${key}`] = JSON.stringify(obfuscatedValue);
    }
    return acc;
  }, {});

  return obfuscated;
};

export default defineConfig({
  plugins: [react()],
  base: '/',
  define: {
    ...obfuscateEnvVars()
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          icons: ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 2000,
    manifest: true,
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true
      }
    }
  },
  server: {
    host: true,
    strictPort: true,
    port: 5173,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    }
  }
});