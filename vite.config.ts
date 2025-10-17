import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to handle role-specific @ imports with better resolution
function roleAliasPlugin(): Plugin {
  return {
    name: 'role-alias',
    enforce: 'pre',
    async resolveId(source: string, importer: string | undefined) {
      if (!source.startsWith('@/') || !importer) {
        return null;
      }

      const sourcePath = source.slice(2); // Remove '@/'
      let basePath: string;

      // Normalize the importer path
      const normalizedImporter = importer.replace(/\\/g, '/');

      // Detect which role context we're in based on the importer path
      // Check for any file within the roles directories
      if (normalizedImporter.includes('/src/roles/creator/')) {
        basePath = path.resolve(__dirname, './src/roles/creator/src');
      } else if (normalizedImporter.includes('/src/roles/innovator/')) {
        basePath = path.resolve(__dirname, './src/roles/innovator/src');
      } else if (normalizedImporter.includes('/src/roles/investor/')) {
        basePath = path.resolve(__dirname, './src/roles/investor/src');
      } else {
        // Default to root src for non-role files  
        basePath = path.resolve(__dirname, './src');
      }

      const resolvedPath = path.resolve(basePath, sourcePath);

      // Try to find the file with different extensions
      const extensions = ['', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'];
      for (const ext of extensions) {
        const fullPath = resolvedPath + ext;
        try {
          if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
            return fullPath;
          }
        } catch (e) {
          // Continue to next extension
        }
      }

      // Try index files if it's a directory
      try {
        if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
          const indexExtensions = ['index.ts', 'index.tsx', 'index.js', 'index.jsx'];
          for (const indexFile of indexExtensions) {
            const indexPath = path.join(resolvedPath, indexFile);
            if (fs.existsSync(indexPath)) {
              return indexPath;
            }
          }
        }
      } catch (e) {
        // Continue
      }

      return null;
    }
  };
}

export default defineConfig({
  plugins: [react(), roleAliasPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@roles": path.resolve(__dirname, "./src/roles")
    }
  },
  server: {
    port: 5173
  },
  build: {
    outDir: "dist"
  }
});
