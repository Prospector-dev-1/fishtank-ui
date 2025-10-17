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
      } catch (e) {}
    });
  } catch (e) {}
  return fileList;
}

function fixRemaining(filePath, content) {
  let fixed = content;
  
  // Determine role context
  const isCreator = filePath.includes('/creator/');
  const isInnovator = filePath.includes('/innovator/');
  const isInvestor = filePath.includes('/investor/');
  
  // Fix @/lib/utils imports
  if (isCreator && fixed.includes('from "@/lib/utils"')) {
    fixed = fixed.replace(/from ["']@\/lib\/utils["']/g, 'from "@/lib/creator/utils"');
  }
  if (isInnovator && fixed.includes('from "@/lib/utils"')) {
    fixed = fixed.replace(/from ["']@\/lib\/utils["']/g, 'from "@/lib/innovator/utils"');
  }
  if (isInvestor && fixed.includes('from "@/lib/utils"')) {
    fixed = fixed.replace(/from ["']@\/lib\/utils["']/g, 'from "@/lib/investor/utils"');
  }
  
  // Fix @/hooks imports
  if (isCreator) {
    fixed = fixed.replace(/from ["']@\/hooks\/use-toast["']/g, 'from "@/components/creator/ui/use-toast"');
    fixed = fixed.replace(/from ["']@\/hooks\/use-mobile["']/g, 'from "@/hooks/creator/use-mobile"');
  }
  if (isInnovator) {
    fixed = fixed.replace(/from ["']@\/hooks\/use-toast["']/g, 'from "@/components/innovator/ui/use-toast"');
    fixed = fixed.replace(/from ["']@\/hooks\/use-mobile["']/g, 'from "@/hooks/innovator/use-mobile"');
    fixed = fixed.replace(/from ["']@\/hooks\/useTeamPermissions["']/g, 'from "@/hooks/innovator/useTeamPermissions"');
    fixed = fixed.replace(/from ["']@\/hooks\/useSmartSearch["']/g, 'from "@/hooks/innovator/useSmartSearch"');
    fixed = fixed.replace(/from ["']@\/hooks\/useAIRecommendations["']/g, 'from "@/hooks/innovator/useAIRecommendations"');
    fixed = fixed.replace(/from ["']@\/lib\/tankApi["']/g, 'from "@/lib/innovator/tankApi"');
    fixed = fixed.replace(/from ["']@\/lib\/creatorTypes["']/g, 'from "@/lib/innovator/creatorTypes"');
  }
  if (isInvestor) {
    fixed = fixed.replace(/from ["']@\/hooks\/use-toast["']/g, 'from "@/components/investor/ui/use-toast"');
    fixed = fixed.replace(/from ["']@\/hooks\/use-mobile["']/g, 'from "@/hooks/investor/use-mobile"');
    fixed = fixed.replace(/from ["']@\/hooks\/useHapticFeedback["']/g, 'from "@/hooks/investor/useHapticFeedback"');
  }
  
  // Fix @/components imports to be role-specific
  if (isCreator) {
    fixed = fixed.replace(/from ["']@\/components\/CreatorCard["']/g, 'from "@/components/creator/CreatorCard"');
    fixed = fixed.replace(/from ["']@\/components\/Community["']/g, 'from "@/components/creator/Community"');
    fixed = fixed.replace(/from ["']@\/components\/CreateTeamModal["']/g, 'from "@/components/creator/CreateTeamModal"');
    fixed = fixed.replace(/from ["']@\/components\/CollaborateInviteModal["']/g, 'from "@/components/creator/CollaborateInviteModal"');
    fixed = fixed.replace(/from ["']@\/components\/ProfileSettings["']/g, 'from "@/components/creator/ProfileSettings"');
    fixed = fixed.replace(/from ["']@\/components\/ProfileHeader["']/g, 'from "@/components/creator/ProfileHeader"');
    fixed = fixed.replace(/from ["']@\/components\/ReferralModal["']/g, 'from "@/components/creator/ReferralModal"');
    fixed = fixed.replace(/from ["']@\/components\/ServiceModal["']/g, 'from "@/components/creator/ServiceModal"');
    fixed = fixed.replace(/from ["']@\/components\/SwipeDeck["']/g, 'from "@/components/creator/SwipeDeck"');
    fixed = fixed.replace(/from ["']@\/components\/ui\/chip["']/g, 'from "@/components/creator/ui/chip"');
  }
  
  if (isInnovator) {
    fixed = fixed.replace(/from ["']@\/components\/tank\/InnovationSetupWizard["']/g, 'from "@/components/innovator/tank/InnovationSetupWizard"');
    fixed = fixed.replace(/from ["']@\/components\/tank\/TankDashboard["']/g, 'from "@/components/innovator/tank/TankDashboard"');
    fixed = fixed.replace(/from ["']@\/components\/network\/VideoFeed["']/g, 'from "@/components/innovator/network/VideoFeed"');
    fixed = fixed.replace(/from ["']@\/components\/network\/ThoughtCard["']/g, 'from "@/components/innovator/network/ThoughtCard"');
    fixed = fixed.replace(/from ["']@\/components\/network\/CreateThought["']/g, 'from "@/components/innovator/network/CreateThought"');
    fixed = fixed.replace(/from ["']@\/components\/modals\/CreateOpportunityModal["']/g, 'from "@/components/innovator/modals/CreateOpportunityModal"');
    fixed = fixed.replace(/from ["']@\/components\/ui\/score-pill["']/g, 'from "@/components/innovator/ui/score-pill"');
  }
  
  if (isInvestor) {
    fixed = fixed.replace(/from ["']@\/components\/VideoPlayer["']/g, 'from "@/components/investor/VideoPlayer"');
    fixed = fixed.replace(/from ["']@\/components\/AdvancedVideoPlayer["']/g, 'from "@/components/investor/AdvancedVideoPlayer"');
    fixed = fixed.replace(/from ["']@\/components\/BottomModal["']/g, 'from "@/components/investor/BottomModal"');
    fixed = fixed.replace(/from ["']@\/components\/EnhancedCard["']/g, 'from "@/components/investor/EnhancedCard"');
    fixed = fixed.replace(/from ["']@\/components\/MessageModal["']/g, 'from "@/components/investor/MessageModal"');
    fixed = fixed.replace(/from ["']@\/components\/MetricDisplay["']/g, 'from "@/components/investor/MetricDisplay"');
    fixed = fixed.replace(/from ["']@\/components\/ModeSwitch["']/g, 'from "@/components/investor/ModeSwitch"');
    fixed = fixed.replace(/from ["']@\/components\/TimeReminderModal["']/g, 'from "@/components/investor/TimeReminderModal"');
    fixed = fixed.replace(/from ["']@\/components\/ui\/chip["']/g, 'from "@/components/investor/ui/chip"');
  }
  
  // Fix data imports
  if (isCreator) {
    fixed = fixed.replace(/from ["']@\/data\/mockData["']/g, 'from "@/lib/creator/mockData"');
  }
  if (isInvestor) {
    fixed = fixed.replace(/from ["']@\/data\/mockData["']/g, 'from "@/data/investor/mockData"');
  }
  
  return fixed;
}

console.log('🔧 Final comprehensive fix...\n');

const srcDir = path.join(__dirname, 'src');
const files = getAllFiles(srcDir);

let fixedCount = 0;

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixed = fixRemaining(filePath, content);
    
    if (content !== fixed) {
      fs.writeFileSync(filePath, fixed, 'utf8');
      fixedCount++;
      const relativePath = path.relative(__dirname, filePath);
      console.log(`✅ Fixed: ${relativePath}`);
    }
  } catch (error) {}
});

console.log(`\n📊 Fixed ${fixedCount} files`);
console.log(`✨ Complete!`);

