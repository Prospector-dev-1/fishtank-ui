# Orphan Routes Analysis
## Fishtank Monorepo Cleanup

**Generated**: October 17, 2025  
**Scope**: Identify unreachable routes and pages  

---

## 🎯 Summary

The legacy root application (`/src/router/App.tsx`) defines routes that are **completely unreachable** because:
1. The root application is not running in the monorepo
2. All navigation occurs within individual role apps
3. The onboarding app redirects to separate app ports

**Total Orphaned Routes**: 5 route definitions  
**Total Orphaned Pages**: 1 page component  
**Risk of Deletion**: 🟢 **NONE** - Routes are not accessed  

---

## 🗺️ Active Route Map (Current Architecture)

### Onboarding App (Port 5173)
**Entry Point**: `apps/onboarding/src/main.tsx`  
**Routes**:
```typescript
// Implicit routing in apps/onboarding/src/pages/Onboarding.tsx
- "Choose Creator" → window.location.href = "http://localhost:5177"
- "Choose Innovator" → window.location.href = "http://localhost:5179"
- "Choose Investor" → window.location.href = "http://localhost:5180"
```

**Status**: ✅ **ACTIVE** - Primary entry point

---

### Creator App (Port 5177)
**Entry Point**: `apps/creator/src/App.tsx`  
**Routes**:
```typescript
/ → Home/Dashboard (src/pages/Home.tsx)
/auth → Auth page (src/pages/Auth.tsx)
/discover → Discover page (src/pages/Discover.tsx)
/network → Network page (src/pages/Network.tsx)
/messages → Messages (src/pages/Messages.tsx)
/profile → Profile (src/pages/Profile.tsx)
/profile/edit → Edit Profile (src/pages/EditProfile.tsx)
/settings → Settings (src/pages/Settings.tsx)
/services → Services (src/pages/Services.tsx)
/availability → Set Availability (src/pages/SetAvailability.tsx)
/earnings → Earnings (src/pages/Earnings.tsx)
/startup/:id → Startup Detail (src/pages/StartupDetail.tsx)
/pitch/:id → Pitch Detail (src/pages/PitchDetail.tsx)
/refer → Referral (src/pages/Referral.tsx)
/endorsements → Endorsements (src/pages/Endorsements.tsx)
/collaborate → Collaborate (src/pages/Collaborate.tsx)
/notifications → Notifications (src/pages/Notifications.tsx)
/not-found → 404 page (src/pages/NotFound.tsx)
```

**Status**: ✅ **ACTIVE** - All routes reachable via bottom nav or links

---

### Innovator App (Port 5179)
**Entry Point**: `apps/innovator/src/App.tsx`  
**Routes**:
```typescript
/ → Index redirect (src/pages/Index.tsx)
/home → Home dashboard (src/pages/Home.tsx)
/auth → Auth page (src/pages/Auth.tsx)
/tank → Innovation Tank (src/pages/Tank.tsx)
/tank/:innovationId → Tank Detail (src/pages/TankDetail.tsx)
/tank/:innovationId/settings → Tank Settings (src/pages/TankSettings.tsx)
/collaborate → Collaborate (src/pages/Collaborate.tsx)
/network → Network/Social (src/pages/Network.tsx)
/search → Search (src/pages/Search.tsx)
/messaging → Messages (src/pages/MessagingNew.tsx)
/profile → Profile (src/pages/Profile.tsx)
/profile/edit → Edit Profile (src/pages/EditProfile.tsx)
/settings → Settings (src/pages/Settings.tsx)
/create-pitch → Create Pitch (src/pages/CreatePitch.tsx)
/insights → Insights (src/pages/Insights.tsx)
/resources → Resources (src/pages/Resources.tsx)
/opportunities → Opportunities (src/pages/Opportunities.tsx)
/opportunity/:id → Opportunity Detail (src/pages/OpportunityDetail.tsx)
/project/:id → Project Detail (src/pages/ProjectDetail.tsx)
/analytics → Analytics (src/pages/Analytics.tsx)
/team → Team Management (src/pages/TeamManagement.tsx)
/video/:id → Video Detail (src/pages/VideoDetail.tsx)
/founder-updates → Founder Updates (src/pages/FounderUpdates.tsx)
/not-found → 404 page (src/pages/NotFound.tsx)
```

**Status**: ✅ **ACTIVE** - All routes reachable

---

### Investor App (Port 5180)
**Entry Point**: `apps/investor/src/App.tsx`  
**Routes**:
```typescript
/ → Index redirect (src/pages/Index.tsx)
/dashboard → Dashboard (src/pages/Dashboard.tsx)
/discover → Swipe Deck (src/pages/Discover.tsx)
/messages → Messages (src/pages/Messages.tsx)
/profile → Profile (src/pages/Profile.tsx)
/profile/edit → Edit Profile (src/pages/EditProfile.tsx)
/settings → Settings (src/pages/Settings.tsx)
/startup/:id → Startup Detail (src/pages/StartupDetail.tsx)
/portfolio → Portfolio (src/pages/Portfolio.tsx)
/auth → Auth page (src/pages/Auth.tsx)
/not-found → 404 page (src/pages/NotFound.tsx)
```

**Status**: ✅ **ACTIVE** - All routes reachable

---

## ❌ Orphaned Routes (Legacy Root App)

### Root App Router
**File**: `src/router/App.tsx` (ORPHANED)  
**Entry Point**: `src/main.tsx` (ORPHANED)  
**Vite Config**: `vite.config.ts` (ROOT - ORPHANED)  
**HTML Entry**: `index.html` (ROOT - references /src/main.tsx)  

### Defined Routes

```typescript
// File: src/router/App.tsx (ORPHANED)

<Routes>
  {/* Route 1: Root redirect */}
  <Route path="/" element={<Navigate to="/onboarding" replace />} />
  
  {/* Route 2: Onboarding page */}
  <Route path="/onboarding" element={<Onboarding />} />
  
  {/* Route 3: Creator routes */}
  <Route path="/creator/*" element={<CreatorAppWrapper />} />
  
  {/* Route 4: Innovator routes */}
  <Route path="/innovator/*" element={<InnovatorAppWrapper />} />
  
  {/* Route 5: Investor routes */}
  <Route path="/investor/*" element={<InvestorAppWrapper />} />
  
  {/* Catch-all redirect */}
  <Route path="*" element={<Navigate to="/onboarding" replace />} />
</Routes>
```

### Orphaned Components

1. **`src/pages/Onboarding.tsx`**  
   - **Status**: ❌ ORPHANED
   - **Evidence**: Never imported by active apps
   - **Replacement**: `apps/onboarding/src/pages/Onboarding.tsx` (active)
   - **Reachability**: IMPOSSIBLE (not in any active router)

2. **`src/components/roles/CreatorAppWrapper.tsx`**  
   - **Status**: 🗑️ **DELETED** (per summary)
   - **Evidence**: Referenced in src/router/App.tsx but file doesn't exist

3. **`src/components/roles/InnovatorAppWrapper.tsx`**  
   - **Status**: 🗑️ **DELETED** (per summary)
   - **Evidence**: Referenced in src/router/App.tsx but file doesn't exist

4. **`src/components/roles/InvestorAppWrapper.tsx`**  
   - **Status**: 🗑️ **DELETED** (per summary)
   - **Evidence**: Referenced in src/router/App.tsx but file doesn't exist

---

## 🔍 Evidence of Unreachability

### 1. No Server Running Root App

**Root package.json scripts**:
```json
{
  "scripts": {
    "dev": "concurrently ... dev:onboarding dev:creator dev:innovator dev:investor",
    "dev:onboarding": "cd apps/onboarding && npm run dev",
    "dev:creator": "cd apps/creator && npm run dev",
    "dev:innovator": "cd apps/innovator && npm run dev",
    "dev:investor": "cd apps/investor && npm run dev"
  }
}
```

**Observation**: 
- ❌ No `vite` command at root
- ❌ Root `index.html` and `src/main.tsx` never executed
- ✅ Only app-level vite servers run

### 2. No Links to Root Routes

**Search for root route references**:
```bash
grep -r "localhost:5173/creator" apps/
grep -r "localhost:5173/innovator" apps/
grep -r "localhost:5173/investor" apps/
# Result: ZERO matches
```

**Onboarding navigation** (actual code):
```typescript
// apps/onboarding/src/pages/Onboarding.tsx
const select = (r: "creator" | "innovator" | "investor") => {
  setSelectedRole(r);
  setTimeout(() => {
    setRole(r);
    // Direct navigation to app ports
    if (r === "creator") window.location.href = "http://localhost:5177";
    if (r === "innovator") window.location.href = "http://localhost:5179";
    if (r === "investor") window.location.href = "http://localhost:5180";
  }, 300);
};
```

**Observation**: Bypasses root router entirely

### 3. Import Analysis

```bash
grep -r "from.*src/router/App" .
# Result: Only src/main.tsx (orphaned file) imports src/router/App.tsx
```

**Conclusion**: Root router has zero consumers

---

## 🗂️ Page Reachability Matrix

| Page Component | Root App | Onboarding | Creator | Innovator | Investor | Status |
|---------------|----------|------------|---------|-----------|----------|--------|
| `src/pages/Onboarding.tsx` | ❌ | ❌ | ❌ | ❌ | ❌ | **ORPHANED** |
| `apps/onboarding/src/pages/Onboarding.tsx` | ❌ | ✅ | ❌ | ❌ | ❌ | **ACTIVE** |
| All `apps/creator/src/pages/*.tsx` | ❌ | ❌ | ✅ | ❌ | ❌ | **ACTIVE** |
| All `apps/innovator/src/pages/*.tsx` | ❌ | ❌ | ❌ | ✅ | ❌ | **ACTIVE** |
| All `apps/investor/src/pages/*.tsx` | ❌ | ❌ | ❌ | ❌ | ✅ | **ACTIVE** |

---

## 🎯 Deletion Recommendations

### Safe to Delete (Zero Impact)

1. **`src/router/App.tsx`**  
   - Defines orphaned routes
   - Not imported by any active code
   - Part of Category A deletion (entire src/)

2. **`src/main.tsx`**  
   - Renders orphaned router
   - Not executed by any npm script
   - Part of Category A deletion

3. **`src/pages/Onboarding.tsx`**  
   - Unreachable page component
   - Replaced by `apps/onboarding/src/pages/Onboarding.tsx`
   - Part of Category A deletion

4. **Root `index.html`**  
   - References `/src/main.tsx` (orphaned)
   - Not served by any vite server
   - Category B deletion (orphaned config)

5. **Root `vite.config.ts`**  
   - Configures root app that doesn't run
   - Category B deletion

---

## 🚨 Pages Requiring Verification (NONE)

**No pages require manual verification**. All page files in `apps/` are actively used.

---

## 📊 Statistics

| Metric | Count |
|--------|-------|
| **Active Apps** | 4 (onboarding, creator, innovator, investor) |
| **Active Routes** | ~60 routes total across all apps |
| **Orphaned Routers** | 1 (src/router/App.tsx) |
| **Orphaned Routes** | 5 route definitions |
| **Orphaned Pages** | 1 (src/pages/Onboarding.tsx) |
| **Orphaned Entry Points** | 2 (index.html, src/main.tsx) |
| **Reachable from UI** | 100% of apps/* pages |
| **Unreachable** | 100% of src/* pages |

---

## ✅ Validation Performed

1. ✅ Searched all apps for imports of `src/router/App`  
   → **Result**: ZERO imports

2. ✅ Searched all apps for links to root routes  
   → **Result**: ZERO links

3. ✅ Checked npm scripts for root vite server  
   → **Result**: No root server

4. ✅ Verified onboarding navigation bypasses root router  
   → **Result**: Direct port navigation

5. ✅ Confirmed all app routes reachable via UI navigation  
   → **Result**: All accessible

---

## 🎉 Conclusion

**All orphaned routes are safe to delete** as part of the Category A deletion (entire `src/` directory).

**No active routes will be affected** by the cleanup.

**Navigation flow is healthy** in the monorepo architecture.

---

**END OF ORPHAN ROUTES ANALYSIS**

