# UI Component Consolidation Plan
## Fishtank Monorepo Cleanup - Phase 2B (Future Work)

**Status**: 🔮 **FUTURE WORK** - Not part of immediate cleanup  
**Generated**: October 17, 2025  
**Scope**: Deduplicate shadcn/ui components across 3 role apps  

---

## 🎯 Executive Summary

The three role apps (Creator, Innovator, Investor) each have **independent shadcn/ui installations** with **59 duplicate UI components** replicated 3 times. This consolidation would:

- **Reduce**: 177 files → 59 canonical files  
- **Save**: ~118 files, ~8,000 LOC  
- **Improve**: Consistency, theming, maintenance  

---

## 📊 Duplication Analysis

### Duplicated UI Components (59 total)

Each component exists in 3 locations:
- `apps/creator/src/components/ui/{component}.tsx`
- `apps/innovator/src/components/ui/{component}.tsx`
- `apps/investor/src/components/ui/{component}.tsx`

#### Complete List

```
accordion.tsx          dialog.tsx           pagination.tsx       sonner.tsx
alert-dialog.tsx       drawer.tsx           popover.tsx          switch.tsx
alert.tsx              dropdown-menu.tsx    progress.tsx         table.tsx
aspect-ratio.tsx       form.tsx             radio-group.tsx      tabs.tsx
avatar.tsx             hover-card.tsx       resizable.tsx        textarea.tsx
badge.tsx              input-otp.tsx        scroll-area.tsx      toast.tsx
breadcrumb.tsx         input.tsx            select.tsx           toaster.tsx
button.tsx             label.tsx            separator.tsx        toggle-group.tsx
calendar.tsx           menubar.tsx          sheet.tsx            toggle.tsx
card.tsx               navigation-menu.tsx  sidebar.tsx          tooltip.tsx
carousel.tsx           checkbox.tsx         skeleton.tsx         use-toast.ts
chart.tsx              collapsible.tsx      slider.tsx
command.tsx            context-menu.tsx
```

#### Additional Duplicated Files

```
components/ui/use-toast.ts (3x)
hooks/use-mobile.tsx (3x)
hooks/use-toast.ts (3x)
lib/utils.ts (3x - cn() helper function)
```

**Total**: 59 UI + 4 utilities = **63 components** × 3 = **189 files**

---

## 🏗️ Proposed Architecture

### Target Structure

```
packages/
└── shared-ui/
    ├── package.json
    ├── src/
    │   ├── components/
    │   │   └── ui/
    │   │       ├── accordion.tsx
    │   │       ├── alert-dialog.tsx
    │   │       ├── alert.tsx
    │   │       └── ... (56 more)
    │   ├── hooks/
    │   │   ├── use-mobile.tsx
    │   │   └── use-toast.ts
    │   ├── lib/
    │   │   └── utils.ts
    │   └── index.ts (barrel export)
    ├── tsconfig.json
    └── README.md
```

### Package Configuration

**`packages/shared-ui/package.json`**:
```json
{
  "name": "@fishtank/shared-ui",
  "version": "1.0.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": "./src/index.ts",
    "./components/*": "./src/components/*.tsx",
    "./hooks/*": "./src/hooks/*.ts",
    "./lib/*": "./src/lib/*.ts"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.1",
    "lucide-react": "^0.344.0",
    "@radix-ui/react-accordion": "^1.1.2",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    ...
  },
  "peerDependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}
```

---

## 🔄 Migration Steps

### Phase 1: Canonical Selection

**Decision**: Use **Creator app** components as canonical source  
**Rationale**:
- Most recently updated
- Clean TypeScript without legacy hacks
- Consistent styling

**Alternatives considered**:
- Innovator: Has extra components (stepper, breadcrumb-nav)
- Investor: Has custom components (investor-card)
- ❌ Rejected: Merge best-of-each (too complex)

### Phase 2: Package Setup

1. **Copy Creator UI to shared-ui**:
   ```bash
   mkdir -p packages/shared-ui/src/components/ui
   cp -r apps/creator/src/components/ui/* packages/shared-ui/src/components/ui/
   cp apps/creator/src/hooks/use-mobile.tsx packages/shared-ui/src/hooks/
   cp apps/creator/src/hooks/use-toast.ts packages/shared-ui/src/hooks/
   cp apps/creator/src/lib/utils.ts packages/shared-ui/src/lib/
   ```

2. **Create barrel export**:
   ```typescript
   // packages/shared-ui/src/index.ts
   export * from './components/ui/accordion'
   export * from './components/ui/alert'
   export * from './components/ui/button'
   // ... (56 more)
   export * from './hooks/use-mobile'
   export * from './hooks/use-toast'
   export * from './lib/utils'
   ```

3. **Install dependencies**:
   ```bash
   cd packages/shared-ui
   npm init -y
   # Merge deps from apps/creator/package.json (@radix-ui/*, etc)
   ```

### Phase 3: Update Apps

For each app (Creator, Innovator, Investor):

1. **Add shared-ui dependency**:
   ```json
   {
     "dependencies": {
       "@fishtank/shared-ui": "workspace:*"
     }
   }
   ```

2. **Update imports** (Example):
   ```typescript
   // BEFORE
   import { Button } from "@/components/ui/button"
   import { Card } from "@/components/ui/card"
   
   // AFTER
   import { Button, Card } from "@fishtank/shared-ui"
   ```

3. **Delete local copies**:
   ```bash
   rm -rf apps/creator/src/components/ui
   rm apps/creator/src/hooks/use-mobile.tsx
   rm apps/creator/src/hooks/use-toast.ts
   rm apps/creator/src/lib/utils.ts
   ```

4. **Test thoroughly**:
   ```bash
   cd apps/creator && npm run dev
   # Visual regression test all pages
   ```

### Phase 4: Handle Custom Components

**Innovator-specific** (not in Creator):
- `stepper.tsx` → Move to `shared-ui` or keep local?
- `breadcrumb-nav.tsx` → Move to `shared-ui` or keep local?

**Decision**: Keep local initially, evaluate later

**Investor-specific**:
- `investor-card.tsx` → Keep local (domain-specific)
- `loading-card.tsx` → Keep local (domain-specific)
- `project-card.tsx` → Keep local (domain-specific)
- `score-pill.tsx` → Keep local (domain-specific)

---

## 🎨 Style Drift Analysis

### Potential Issues

1. **Tailwind Classes**: May differ slightly across apps
2. **Theme Colors**: CSS variables may conflict
3. **Component Variants**: CVA configs may differ
4. **Responsive Breakpoints**: May be customized per app

### Mitigation Strategy

**Pre-consolidation audit**:
```bash
# Compare button.tsx implementations
diff apps/creator/src/components/ui/button.tsx \
     apps/innovator/src/components/ui/button.tsx

diff apps/creator/src/components/ui/button.tsx \
     apps/investor/src/components/ui/button.tsx
```

**Resolution**:
- If identical → Use Creator version
- If minor diffs → Manual merge (prefer most modern)
- If major diffs → Keep local copy, note in consolidation_exceptions.md

---

## 📋 Import Update Matrix

### Files Requiring Updates

**Creator App**: 77 component files + 17 page files = **94 files**  
**Innovator App**: 94 component files + 24 page files = **118 files**  
**Investor App**: 83 component files + 11 page files = **94 files**  

**Total**: **306 files** requiring import updates

### Automated Migration Tool

```typescript
// scripts/migrate-shared-ui-imports.ts
import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const files = glob.sync('apps/*/src/**/*.{ts,tsx}');

files.forEach(file => {
  let content = readFileSync(file, 'utf8');
  
  // Replace local UI imports
  content = content.replace(
    /from ["']@\/components\/ui\/([^"']+)["']/g,
    'from "@fishtank/shared-ui"'
  );
  
  // Replace use-toast import
  content = content.replace(
    /from ["']@\/hooks\/use-toast["']/g,
    'from "@fishtank/shared-ui"'
  );
  
  // Replace utils import
  content = content.replace(
    /from ["']@\/lib\/utils["']/g,
    'from "@fishtank/shared-ui"'
  );
  
  writeFileSync(file, content);
});
```

**Run**:
```bash
npx tsx scripts/migrate-shared-ui-imports.ts
```

---

## 🧪 Testing Plan

### Visual Regression

1. **Playwright snapshots** (before):
   ```bash
   npm run test:visual:baseline
   ```

2. **Consolidate components**

3. **Playwright comparison** (after):
   ```bash
   npm run test:visual:compare
   ```

4. **Review diffs** in `/test-results/visual-diffs/`

### Manual QA Checklist

For each app (Creator, Innovator, Investor):

- [ ] Home/Dashboard page renders
- [ ] All buttons clickable
- [ ] All forms submittable
- [ ] All modals open/close
- [ ] All dropdowns work
- [ ] All tooltips show on hover
- [ ] All cards render correctly
- [ ] Mobile responsive (375px, 768px, 1024px)
- [ ] Dark mode (if applicable)
- [ ] Keyboard navigation
- [ ] Screen reader accessibility

---

## ⚠️ Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Style drift breaks UI | 🟡 Medium | 🔴 High | Pre-audit diffs, visual regression |
| Import paths broken | 🟢 Low | 🟡 Medium | Automated script + TSC check |
| Build errors | 🟢 Low | 🟡 Medium | Test build before commit |
| Radix version conflicts | 🟡 Medium | 🟡 Medium | Align all @radix-ui/* versions |
| Theme CSS var conflicts | 🟡 Medium | 🟢 Low | Test all apps side-by-side |

---

## 📈 Success Metrics

| Metric | Before | After | Delta |
|--------|--------|-------|-------|
| **Files** | 189 UI files | 63 canonical | -126 files (-66%) |
| **LOC** | ~12,000 | ~4,000 | -8,000 LOC |
| **Bundle Size** | TBD | TBD | Expected -5% |
| **Build Time** | TBD | TBD | Expected -10% |
| **Maintenance** | 3x effort | 1x effort | 66% reduction |

---

## 🚀 Execution Timeline

**Estimated Effort**: 2-3 days  
**Risk Level**: 🟡 MEDIUM  
**Priority**: P2 (Not urgent, high value)  

### Breakdown

- **Day 1**: Setup shared-ui package, copy files, create exports
- **Day 2**: Run automated import migration, fix build errors
- **Day 3**: Visual regression testing, manual QA, fixes

---

## 🔄 Rollback Plan

If consolidation causes issues:

```bash
# Revert the consolidation commits
git revert <commit-hash-range>

# Or restore from tag
git reset --hard pre-consolidation-tag
```

**Note**: Keep local copies in separate branch until confident

---

## 📝 Consolidation Exceptions

Components to **NOT consolidate** (keep local):

### Investor App
- `components/ui/investor-card.tsx` - Domain-specific
- `components/ui/loading-card.tsx` - Domain-specific  
- `components/ui/project-card.tsx` - Domain-specific
- `components/ui/score-pill.tsx` - Domain-specific

### Innovator App
- `components/ui/stepper.tsx` - Not in Creator/Investor
- `components/ui/breadcrumb-nav.tsx` - Not in Creator/Investor

---

## ✅ Definition of Done

- [ ] `packages/shared-ui/` package created with all UI components
- [ ] All 306 files updated with new imports
- [ ] All apps build successfully (`npm run build`)
- [ ] All apps run successfully (`npm run dev`)
- [ ] Visual regression tests pass
- [ ] Manual QA checklist complete
- [ ] No TypeScript errors
- [ ] No console errors/warnings
- [ ] Documentation updated (README, MIGRATION_NOTES)
- [ ] PR reviewed and approved

---

**STATUS**: 📋 **PLANNED** - Not executing in PHASE 2  
**Recommendation**: Defer to separate PR after immediate cleanup complete  
**Tracking**: Create GitHub issue for future consolidation work  

---

**END OF CONSOLIDATION PLAN**

