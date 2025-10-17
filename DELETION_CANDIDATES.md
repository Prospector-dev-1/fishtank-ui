# Deletion Candidates

This document tracks files and folders identified as candidates for deletion during the codebase cleanup. Each entry includes evidence and justification.

## Status Legend
- ✅ SAFE TO DELETE: Confirmed duplicate or unused with no dependencies
- ⚠️ NEEDS REVIEW: Potentially unused but requires validation
- ❌ KEEP: Required for backend/database integration or future use

---

## Duplicate Folders (✅ SAFE TO DELETE)

### Duplicate UI Component Folders
**Evidence**: Directory structure shows numbered duplicates (` 2`, ` 3`, etc.)

1. **`src/components/creator/ui 2/`**
   - Reason: Duplicate of `src/components/creator/ui/`
   - Evidence: Folder naming pattern indicates copy
   - Impact: None - original exists at `src/components/creator/ui/`

2. **`src/components/innovator/home 2/`**
   - Reason: Duplicate of `src/components/innovator/home/`
   - Evidence: Folder naming pattern indicates copy
   - Impact: None - original exists

3. **`src/components/innovator/layout 2/`**
   - Reason: Duplicate of `src/components/innovator/layout/`
   - Evidence: Folder naming pattern indicates copy
   - Impact: None - original exists

4. **`src/components/innovator/messaging 2/`**
   - Reason: Duplicate of `src/components/innovator/messaging/`
   - Evidence: Folder naming pattern indicates copy
   - Impact: None - original exists

5. **`src/components/innovator/modals 2/`**
   - Reason: Duplicate of `src/components/innovator/modals/`
   - Evidence: Folder naming pattern indicates copy
   - Impact: None - original exists

6. **`src/components/innovator/network 2/`**
   - Reason: Duplicate of `src/components/innovator/network/`
   - Evidence: Folder naming pattern indicates copy
   - Impact: None - original exists

7. **`src/components/innovator/profile 2/`**
   - Reason: Duplicate of `src/components/innovator/profile/`
   - Evidence: Folder naming pattern indicates copy
   - Impact: None - original exists

8. **`src/components/innovator/tank 2/`**
   - Reason: Duplicate of `src/components/innovator/tank/`
   - Evidence: Folder naming pattern indicates copy
   - Impact: None - original exists

9. **`src/components/innovator/ui 2/`**
   - Reason: Duplicate of `src/components/innovator/ui/`
   - Evidence: Folder naming pattern indicates copy
   - Impact: None - original exists

10. **`src/components/investor/ui 2/`**
    - Reason: Duplicate of `src/components/investor/ui/`
    - Evidence: Folder naming pattern indicates copy
    - Impact: None - original exists

11. **`src/integrations/supabase 2/`**
    - Reason: Duplicate of `src/integrations/supabase/`
    - Evidence: Folder naming pattern indicates copy
    - Impact: None - original exists at `src/integrations/supabase/`

---

## Duplicate Build Artifacts (✅ SAFE TO DELETE)

### In `dist/` folders
**Evidence**: Multiple numbered copies of built files

All duplicate files in:
- `dist/` (root)
- `apps/creator/dist/`
- `apps/innovator/dist/`
- `apps/investor/dist/`
- `apps/onboarding/dist/`

Files to delete:
- `index 2.html`, `index 3.html` (keep `index.html`)
- `favicon 2.ico`, `favicon 3.ico` (keep `favicon.ico`)
- `placeholder 2.svg`, `placeholder 3.svg` (keep `placeholder.svg`)
- `robots 2.txt`, `robots 3.txt` (keep `robots.txt`)
- `assets 2/`, `assets 3/` folders (keep `assets/`)
- `startup-video-* 2.jpg`, `startup-video-* 3.jpg` (keep originals)

**Note**: These are build artifacts and can be regenerated. The entire `dist/` folder and `apps/*/dist/` folders are typically gitignored and rebuilt on deploy.

---

## Old Migration/Fix Scripts (✅ SAFE TO DELETE)

**Evidence**: Scripts with "fix" in the name, likely one-time migration tools

1. **`fix-all-remaining.mjs`**
   - Reason: One-time migration script
   - Evidence: Migration notes indicate backend purge is complete
   - Impact: None - migration complete

2. **`fix-component-imports.mjs`**
   - Reason: One-time migration script
   - Evidence: `IMPORT_FIX_COMPLETE.md` indicates completion
   - Impact: None - migration complete

3. **`fix-final-imports.mjs`**
   - Reason: One-time migration script
   - Evidence: Import fixes completed per documentation
   - Impact: None - migration complete

4. **`fix-imports.mjs`**
   - Reason: One-time migration script
   - Evidence: Import fixes completed per documentation
   - Impact: None - migration complete

---

## Unused Documentation/Archive Files (⚠️ NEEDS REVIEW)

These files document completed migrations and might be safely archived:

1. **`ALL_NAVIGATION_FIXES.md`**
   - Reason: Historical record of completed navigation fixes
   - Status: Completed per `NAVIGATION_FIX_COMPLETE.md`
   - Recommendation: Move to `_archive/migration-history/` if not already there

2. **`INVESTOR_NAVIGATION_FIXES.md`**
   - Reason: Historical record of completed fixes
   - Status: Completed
   - Recommendation: Move to `_archive/migration-history/`

3. **`IMPORT_FIX_COMPLETE.md`**
   - Reason: Historical record of completed import fixes
   - Status: Completed
   - Recommendation: Move to `_archive/migration-history/`

4. **`NAVIGATION_FIX_COMPLETE.md`**
   - Reason: Historical record of completed fixes
   - Status: Completed
   - Recommendation: Move to `_archive/migration-history/`

5. **`UNIFIED_APP_COMPLETE.md`**
   - Reason: Historical record of unification completion
   - Status: Completed
   - Recommendation: Move to `_archive/migration-history/`

6. **`MIGRATION_NOTES.md`**
   - Reason: Historical migration documentation
   - Recommendation: Move to `_archive/migration-history/`

---

## Unused Pages/Components (⚠️ NEEDS REVIEW)

### Based on import analysis and route inspection:

1. **`src/pages/investor/Index.tsx`**
   - Status: Imported in App.tsx (line 62) but declared unused (TS6133)
   - Evidence: Not used in routing (no <InvestorIndex /> in routes)
   - Recommendation: Verify and delete if truly unused

---

## Build Configuration Files (❌ KEEP)

**Keep for build/deployment**:
- `apps/onboarding/tsconfig.tsbuildinfo` - TypeScript build cache
- `apps/onboarding/tsconfig.node.tsbuildinfo` - TypeScript build cache

---

## Backend/Database Integration Files (❌ KEEP)

**Reason**: User explicitly mentioned backend/database will be added later

- `src/contexts/AuthContext.tsx` - Auth integration needed
- `src/integrations/supabase/` - Database client
- `src/store/fishtankStore.ts` - State management for backend data
- All files in `src/data/` - Mock data that will be replaced with real data
- All files in `src/types/` - Type definitions needed for backend

---

## Summary

### Immediate Deletions (Low Risk)
- 11 duplicate folders with ` 2` or ` 3` suffix
- Duplicate build artifacts in `dist/` folders
- 4 old migration scripts (`.mjs` files)

### Review Required
- 6 completed migration documentation files (consider archiving)
- 1 potentially unused page component

### Files to Keep
- All auth, database integration, and type definition files
- All current source code in active use

