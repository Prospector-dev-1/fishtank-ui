import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to recursively find all .tsx and .ts files
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

// Fix imports based on file location
function fixImports(filePath, content) {
  let fixed = content;
  
  // Determine the role based on file path
  const isCreatorFile = filePath.includes('/pages/creator/') || filePath.includes('/lib/creator/');
  const isInnovatorFile = filePath.includes('/pages/innovator/') || filePath.includes('/lib/innovator/');
  const isInvestorFile = filePath.includes('/pages/investor/') || filePath.includes('/lib/investor/') || filePath.includes('/data/investor/');
  
  if (isInvestorFile) {
    // Fix investor-specific imports
    fixed = fixed.replace(/from ["']@\/components\/VideoPlayer["']/g, 'from "@/components/investor/VideoPlayer"');
    fixed = fixed.replace(/from ["']@\/components\/ActionButton["']/g, 'from "@/components/investor/ActionButton"');
    fixed = fixed.replace(/from ["']@\/components\/SwipeCard["']/g, 'from "@/components/investor/SwipeCard"');
    fixed = fixed.replace(/from ["']@\/components\/FilterTabs["']/g, 'from "@/components/investor/FilterTabs"');
    fixed = fixed.replace(/from ["']@\/components\/ui\/chip["']/g, 'from "@/components/investor/ui/chip"');
    fixed = fixed.replace(/from ["']@\/data\/mockData["']/g, 'from "@/data/investor/mockData"');
    fixed = fixed.replace(/from ["']@\/lib\/utils["']/g, 'from "@/lib/investor/utils"');
  }
  
  if (isInnovatorFile) {
    // Fix innovator-specific imports
    fixed = fixed.replace(/from ["']@\/components\/layout\/FishtankHeader["']/g, 'from "@/components/innovator/layout/FishtankHeader"');
    fixed = fixed.replace(/from ["']@\/components\/messaging\/FriendRequests["']/g, 'from "@/components/innovator/messaging/FriendRequests"');
    fixed = fixed.replace(/from ["']@\/components\/messaging\/TeamInvitations["']/g, 'from "@/components/innovator/messaging/TeamInvitations"');
    fixed = fixed.replace(/from ["']@\/components\/ui\/empty-state["']/g, 'from "@/components/innovator/ui/empty-state"');
    fixed = fixed.replace(/from ["']@\/hooks\/use-toast["']/g, 'from "@/components/innovator/ui/use-toast"');
    fixed = fixed.replace(/from ["']@\/lib\/tankApi["']/g, 'from "@/lib/innovator/tankApi"');
    fixed = fixed.replace(/from ["']@\/lib\/utils["']/g, 'from "@/lib/innovator/utils"');
    fixed = fixed.replace(/from ["']@\/store\/fishtankStore["']/g, 'from "@/store/fishtankStore"');
  }
  
  if (isCreatorFile) {
    // Fix creator-specific imports
    fixed = fixed.replace(/from ["']@\/assets\/creator-avatar\.jpg["']/g, 'from "@/assets/creator-avatar.jpg"');
    fixed = fixed.replace(/from ["']@\/assets\/innovator-sarah\.jpg["']/g, 'from "@/assets/innovator-sarah.jpg"');
    fixed = fixed.replace(/from ["']@\/assets\/innovator-marcus\.jpg["']/g, 'from "@/assets/innovator-marcus.jpg"');
    fixed = fixed.replace(/from ["']@\/lib\/creatorData["']/g, 'from "@/lib/creator/creatorData"');
    fixed = fixed.replace(/from ["']@\/lib\/creatorTypes["']/g, 'from "@/lib/creator/creatorTypes"');
    fixed = fixed.replace(/from ["']@\/lib\/mockData["']/g, 'from "@/lib/creator/mockData"');
    fixed = fixed.replace(/from ["']@\/lib\/types["']/g, 'from "@/lib/creator/types"');
    fixed = fixed.replace(/from ["']@\/lib\/utils["']/g, 'from "@/lib/creator/utils"');
    fixed = fixed.replace(/from ["']@\/data\/creators["']/g, 'from "@/data/creators"');
    fixed = fixed.replace(/from ["']@\/data\/startups["']/g, 'from "@/data/startups"');
  }
  
  // Fix UI component imports for all roles
  if (isCreatorFile) {
    fixed = fixed.replace(/@\/components\/ui\//g, '@/components/creator/ui/');
  } else if (isInnovatorFile) {
    fixed = fixed.replace(/@\/components\/ui\//g, '@/components/innovator/ui/');
  } else if (isInvestorFile) {
    fixed = fixed.replace(/@\/components\/ui\//g, '@/components/investor/ui/');
  }
  
  return fixed;
}

// Process all files
console.log('🔧 Starting import path fixes...\n');

const srcDir = path.join(__dirname, 'src');
const files = getAllFiles(srcDir);

let fixedCount = 0;
let errorCount = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixImports(filePath, content);
    
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      fixedCount++;
      const relativePath = path.relative(__dirname, filePath);
      console.log(`✅ Fixed: ${relativePath}`);
    }
  } catch (error) {
    errorCount++;
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
});

console.log(`\n📊 Summary:`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`   Total processed: ${files.length} files`);
console.log(`\n✨ Import fix complete!`);

