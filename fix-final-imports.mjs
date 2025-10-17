import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAllFiles(dir, fileList = []) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      try {
        if (fs.statSync(filePath).isDirectory()) {
          getAllFiles(filePath, fileList);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          fileList.push(filePath);
        }
      } catch (e) {
        // Skip files we can't access
      }
    });
  } catch (e) {
    // Skip directories we can't access
  }
  
  return fileList;
}

function fixFinalImports(filePath, content) {
  let fixed = content;
  
  const isInnovatorFile = filePath.includes('/innovator/');
  
  // Fix innovator modals that import from @/types and @/lib/storage
  if (isInnovatorFile) {
    fixed = fixed.replace(/from ["']@\/types["']/g, 'from "@/types"');
    fixed = fixed.replace(/from ["']@\/lib\/fishtankApiExtended["']/g, 'from "@/lib/innovator/fishtankApiExtended"');
    fixed = fixed.replace(/from ["']@\/lib\/storage["']/g, 'from "@/lib/innovator/storage"');
    fixed = fixed.replace(/from ["']@\/components\/ui\/pull-to-refresh["']/g, 'from "@/components/innovator/ui/pull-to-refresh"');
  }
  
  // Remove circular dependencies in use-toast
  if (filePath.endsWith('/use-toast.ts')) {
    // Fix circular import by removing the self-import
    fixed = fixed.replace(/^export \{ useToast, toast \} from "\.\/use-toast";?\s*$/m, '');
  }
  
  return fixed;
}

console.log('🔧 Final import fixes...\n');

const srcDir = path.join(__dirname, 'src');
const files = getAllFiles(srcDir);

let fixedCount = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixFinalImports(filePath, content);
    
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      fixedCount++;
      const relativePath = path.relative(__dirname, filePath);
      console.log(`✅ Fixed: ${relativePath}`);
    }
  } catch (error) {
    // Skip files we can't process
  }
});

console.log(`\n📊 Fixed ${fixedCount} files`);
console.log(`✨ Final import fix complete!`);

