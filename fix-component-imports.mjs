import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

function fixComponentImports(filePath, content) {
  let fixed = content;
  
  const isCreatorComponent = filePath.includes('/components/creator/');
  const isInnovatorComponent = filePath.includes('/components/innovator/');
  const isInvestorComponent = filePath.includes('/components/investor/');
  
  // Fix Creator component imports
  if (isCreatorComponent) {
    fixed = fixed.replace(/from ["']@\/lib\/utils["']/g, 'from "@/lib/creator/utils"');
    fixed = fixed.replace(/from ["']@\/lib\/creatorTypes["']/g, 'from "@/lib/creator/creatorTypes"');
    fixed = fixed.replace(/from ["']@\/lib\/mockData["']/g, 'from "@/lib/creator/mockData"');
    fixed = fixed.replace(/from ["']@\/lib\/types["']/g, 'from "@/lib/creator/types"');
    fixed = fixed.replace(/from ["']@\/hooks\/use-toast["']/g, 'from "@/components/creator/ui/use-toast"');
    fixed = fixed.replace(/from ["']@\/hooks\/use-mobile["']/g, 'from "@/hooks/creator/use-mobile"');
    fixed = fixed.replace(/from ["']@\/data\/creators["']/g, 'from "@/data/creators"');
    fixed = fixed.replace(/from ["']@\/data\/startups["']/g, 'from "@/data/startups"');
  }
  
  // Fix Innovator component imports
  if (isInnovatorComponent) {
    fixed = fixed.replace(/from ["']@\/lib\/utils["']/g, 'from "@/lib/innovator/utils"');
    fixed = fixed.replace(/from ["']@\/hooks\/use-toast["']/g, 'from "@/components/innovator/ui/use-toast"');
    fixed = fixed.replace(/from ["']@\/hooks\/use-mobile["']/g, 'from "@/hooks/innovator/use-mobile"');
  }
  
  // Fix Investor component imports
  if (isInvestorComponent) {
    fixed = fixed.replace(/from ["']@\/lib\/utils["']/g, 'from "@/lib/investor/utils"');
    fixed = fixed.replace(/from ["']@\/hooks\/use-toast["']/g, 'from "@/components/investor/ui/use-toast"');
    fixed = fixed.replace(/from ["']@\/hooks\/use-mobile["']/g, 'from "@/hooks/investor/use-mobile"');
    fixed = fixed.replace(/from ["']@\/data\/mockData["']/g, 'from "@/data/investor/mockData"');
  }
  
  return fixed;
}

console.log('🔧 Fixing component imports...\n');

const componentsDir = path.join(__dirname, 'src/components');
const files = getAllFiles(componentsDir);

let fixedCount = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixComponentImports(filePath, content);
    
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      fixedCount++;
      const relativePath = path.relative(__dirname, filePath);
      console.log(`✅ Fixed: ${relativePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n📊 Fixed ${fixedCount} component files`);
console.log(`✨ Component import fix complete!`);

