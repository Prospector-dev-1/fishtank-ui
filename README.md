# Fishtank - Unified Application

> **Where innovation meets opportunity**

A unified mobile-first platform connecting creators, innovators, and investors in a single, seamless application.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-Private-red)

---

## 🎯 Overview

Fishtank is a comprehensive platform where:
- **Innovators** pitch ideas with video presentations and manage their startups
- **Creators** (vetted freelancers and interns) showcase portfolios and discover opportunities
- **Investors** swipe through startups, conduct due diligence, and manage deal flow

All three personas operate within a **single unified application** with shared infrastructure and seamless cross-role interactions.

---

## ✨ What's New

- **October 2025**: Successfully unified from 4 separate applications into ONE codebase
- **Single Dev Server**: All roles run on one development server (port 8080)
- **Optimized Architecture**: Cleaned up duplicates, removed dead code, zero circular dependencies
- **Production Ready**: Verified build pipeline, comprehensive routing, modern tech stack

---

## 🏗️ Architecture

### Directory Structure

```
Unified-App/
├── src/
│   ├── pages/                    # Route components
│   │   ├── onboarding/          # Landing & role selection
│   │   ├── creator/             # Creator interface (17 pages)
│   │   ├── innovator/           # Innovator interface (25 pages)
│   │   └── investor/            # Investor interface (10 pages)
│   │
│   ├── components/               # UI components
│   │   ├── ui/                  # Shared UI primitives (shadcn/ui)
│   │   ├── creator/             # Creator-specific components
│   │   ├── innovator/           # Innovator-specific components
│   │   └── investor/            # Investor-specific components
│   │
│   ├── lib/                      # Utilities & helpers
│   │   ├── utils.ts             # Shared utilities
│   │   ├── creator/             # Creator utilities & types
│   │   ├── innovator/           # Innovator utilities & types
│   │   └── investor/            # Investor utilities & types
│   │
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-mobile.tsx       # Responsive breakpoint detection
│   │   ├── use-toast.ts         # Toast notifications
│   │   ├── creator/             # Creator-specific hooks
│   │   ├── innovator/           # Innovator-specific hooks
│   │   └── investor/            # Investor-specific hooks
│   │
│   ├── contexts/                 # React Context providers
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── NavigationContext.tsx # Navigation state
│   │
│   ├── store/                    # Zustand state management
│   │   └── fishtankStore.ts     # Global app state
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts             # Shared types
│   │
│   ├── data/                     # Mock data (to be replaced with API)
│   │   ├── creators.ts          # Creator mock data
│   │   ├── startups.ts          # Startup mock data
│   │   └── investor/mockData.ts # Investor mock data
│   │
│   ├── integrations/             # Third-party services
│   │   └── supabase/            # Supabase client & types
│   │
│   ├── assets/                   # Images & static files
│   ├── App.tsx                   # Main router & providers
│   ├── main.tsx                  # Application entry point
│   └── index.css                 # Global styles
│
├── public/                       # Static assets
├── dist/                         # Production build output
├── var/                          # Analysis & logs
│   ├── baseline-typecheck.log   # TypeScript baseline
│   ├── circular-deps.log        # Dependency analysis
│   └── unused-exports.log       # Code quality metrics
│
├── package.json                  # Dependencies & scripts
├── vite.config.ts               # Vite configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── postcss.config.js            # PostCSS configuration
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Unified-App

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at **http://localhost:8080**

### Building for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

### Code Quality & Analysis

```bash
# Run TypeScript type checking
npm run typecheck

# Run ESLint
npm run lint

# Run full verification (typecheck + lint + build)
npm run verify

# Analyze circular dependencies
npm run analyze:circular

# Find unused exports
npm run analyze:unused

# Generate dependency graph (outputs to var/deps-graph.svg)
npm run analyze:graph
```

---

## 🎭 User Personas & Features

### 👨‍🎨 Creator Interface (`/creator/*`)

**For freelancers, designers, developers, and interns**

**Features:**
- 🏠 **Home** - Personalized dashboard with opportunities
- 🔍 **Discover** - Browse and discover new projects
- 🌐 **Network** - Connect with other creators and teams
- 📬 **Inbox** - Manage messages and communications
- 👤 **Profile** - Showcase your portfolio and skills
- ✏️ **Edit Profile** - Update your information and portfolio
- 💰 **Earnings** - Track payments and financial history
- 📝 **Proposals** - Manage sent and received proposals
- 💾 **Saved** - Bookmark interesting opportunities
- ⚖️ **Disputes** - Handle conflicts and resolutions
- ⚙️ **Settings** - Configure account preferences
- 👥 **Team Info** - View and manage team collaborations
- 🔐 **Auth** - Secure login and registration
- 🎯 **Onboarding** - Guided setup for new creators

**Key Capabilities:**
- Portfolio showcasing with images and case studies
- Project discovery and application
- Team collaboration and invitations
- Service offerings and pricing
- Earnings tracking and payment management
- Proposal and contract management
- NDA signing and dispute resolution

---

### 💡 Innovator Interface (`/innovator/*`)

**For entrepreneurs, startup founders, and innovators**

**Features:**
- 🏠 **Home** - Dashboard with pitch performance metrics
- 🐠 **Tank** - Manage your innovation and pitch deck
- 🎥 **Create Pitch** - Record and upload video pitches
- 📊 **Pitch Analytics** - View engagement and performance data
- 🚀 **Boost Pitch** - Promote your pitch to investors
- 🌐 **Network** - Connect with investors and collaborators
- 🤝 **Collaborate** - Find and work with creators
- 💬 **Messaging** - Real-time chat with stakeholders
- 👤 **Profile** - Your innovator profile
- ✏️ **Edit Profile** - Update your information
- 👥 **User Profiles** - View other users' profiles
- 🔍 **Search** - Find investors, creators, and opportunities
- 📈 **Analytics** - Detailed performance metrics
- 📄 **NDA Request** - Request NDAs from interested parties
- 📋 **NDA Settings** - Configure NDA requirements
- ⚙️ **Innovation Settings** - Manage pitch settings
- 📝 **Edit Innovation** - Update pitch details
- 📅 **Scheduling** - Coordinate meetings and calls
- 👥 **Team Management** - Manage your startup team
- 📁 **Project Detail** - View detailed project information
- 🔐 **Auth** - Secure authentication
- 🎯 **Pitch View** - View individual pitch details

**Key Capabilities:**
- Video pitch creation and management
- Team formation and permissions
- NDA workflow management
- Investor targeting and filtering
- Analytics and engagement tracking
- Collaboration with creators for assets
- Meeting scheduling and coordination
- Pitch boosting and promotion

---

### 💼 Investor Interface (`/investor/*`)

**For angel investors, VCs, and funding organizations**

**Features:**
- 📊 **Dashboard** - Investment portfolio overview
- 📈 **Deal Flow** - Manage incoming opportunities
- 🌍 **Market Intel** - Industry trends and insights
- 🔍 **Discover** - Tinder-style startup swiping
- 🏢 **Startup Detail** - Comprehensive startup profiles
- 📄 **NDA Agreement** - Sign NDAs before viewing details
- 👥 **Team Member Profile** - View startup team members
- 💬 **Messages** - Communication hub
- 👤 **Profile** - Investor profile and preferences

**Key Capabilities:**
- Swipe-based startup discovery
- AI-powered recommendations
- Due diligence tools and checklists
- NDA management workflow
- Portfolio tracking and analytics
- Direct messaging with founders
- Market intelligence and trends
- Smart search and filtering
- Team evaluation and background research

---

## 🎯 Navigation Flow

### Onboarding

1. User lands on `/` (onboarding page)
2. Chooses their role: Creator, Innovator, or Investor
3. Gets routed to the appropriate interface
4. All navigation happens in-app (SPA - Single Page Application)

### Route Structure

| Role | Base Route | Example Pages |
|------|-----------|---------------|
| **Onboarding** | `/` | Role selection |
| **Creator** | `/creator/*` | `/creator/home`, `/creator/discover` |
| **Innovator** | `/innovator/*` | `/innovator/tank`, `/innovator/pitch/new` |
| **Investor** | `/investor/*` | `/investor/discover`, `/investor/deal-flow` |

### Protected Routes

- Most pages require authentication (handled by `AuthContext`)
- Creator routes use `ProtectedRoute` component
- Innovator routes use `InnovatorProtectedRoute` wrapper
- Investor routes are currently open (authentication to be added)

---

## 🛠️ Tech Stack

### Core

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.3.1 | UI framework |
| **TypeScript** | 5.8.3 | Type safety |
| **Vite** | 5.4.20 | Build tool & dev server |
| **React Router** | 6.30.1 | Client-side routing |

### UI & Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **shadcn/ui** | Latest | Component primitives |
| **Radix UI** | Various | Accessible components |
| **Lucide React** | 0.462.0 | Icon library |
| **next-themes** | 0.3.0 | Theme management |

### State & Data

| Technology | Version | Purpose |
|------------|---------|---------|
| **Zustand** | 5.0.8 | State management |
| **TanStack Query** | 5.83.0 | Data fetching & caching |
| **React Hook Form** | 7.63.0 | Form management |
| **Zod** | 3.25.76 | Schema validation |

### Backend & Integration

| Technology | Version | Purpose |
|------------|---------|---------|
| **Supabase** | 2.49.2 | Backend-as-a-Service (ready for integration) |
| **date-fns** | 3.6.0 | Date utilities |

### Development Tools

| Technology | Version | Purpose |
|------------|---------|---------|
| **ESLint** | 9.32.0 | Code linting |
| **madge** | 8.0.0 | Dependency analysis |
| **ts-prune** | 0.10.3 | Unused export detection |

---

## 🎨 Design Philosophy

### Mobile-First Approach

- Designed primarily for mobile devices (iOS & Android)
- Desktop support included but mobile is the priority
- Touch-optimized interactions and gestures
- Native-like feel with smooth animations

### iOS-Inspired Design

- Clean, minimalist interfaces
- System-standard spacing and typography
- Contextual modals and bottom sheets
- Haptic feedback (on supported devices)
- Safe area handling for modern devices

### Dark Mode

- Dark theme by default
- System theme detection and sync
- Optimized for OLED displays
- Consistent color palette across all personas

### Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Screen reader compatibility
- High contrast ratios for text
- Focus indicators for navigation

### Performance

- Code splitting by route
- Lazy loading of components
- Optimized images and assets
- Minimal bundle size
- Fast Time to Interactive (TTI)

---

## 📦 Component Architecture

### Shared Components (`src/components/ui/`)

Reusable UI primitives built on Radix UI and styled with Tailwind:

- **Forms**: Button, Input, Textarea, Select, Checkbox, Radio, Switch
- **Layout**: Card, Sheet, Dialog, Drawer, Tabs, Accordion
- **Feedback**: Toast, Alert, Progress, Skeleton
- **Navigation**: Dropdown Menu, Navigation Menu, Command Palette
- **Data Display**: Table, Avatar, Badge, Tooltip
- **And more**: 58 components total

### Persona-Specific Components

Each persona has its own component library:

- **Creator**: 20+ components (SwipeDeck, ProfileHeader, ServiceModal, etc.)
- **Innovator**: 30+ components (Pitch cards, Tank management, Team tools, etc.)
- **Investor**: 20+ components (SwipeCard, DueDiligence, MarketIntel, etc.)

### Component Naming Convention

```typescript
// Shared components use lowercase with hyphens
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Persona-specific components use PascalCase
import { SwipeDeck } from "@/components/creator/SwipeDeck";
import { PitchCard } from "@/components/innovator/tank/PitchCard";
```

---

## 🔧 Development Guidelines

### Adding a New Page

```typescript
// 1. Create page component
// src/pages/creator/NewFeature.tsx
export default function NewFeature() {
  return <div>My New Feature</div>;
}

// 2. Add route in App.tsx
<Route path="new-feature" element={<NewFeature />} />
```

### Adding Shared Components

```typescript
// Place in src/components/ui/ for cross-persona components
// src/components/ui/my-component.tsx
export function MyComponent() {
  return <div>Shared Component</div>;
}

// Import anywhere using path alias
import { MyComponent } from "@/components/ui/my-component";
```

### Adding Persona-Specific Code

```typescript
// Keep role-specific logic in role directories
// src/components/creator/SpecialCard.tsx
// src/lib/creator/helpers.ts
// src/hooks/creator/useSpecialHook.ts

// Import with path alias
import { SpecialCard } from "@/components/creator/SpecialCard";
import { helperFunction } from "@/lib/creator/helpers";
import { useSpecialHook } from "@/hooks/creator/useSpecialHook";
```

### TypeScript Best Practices

```typescript
// Define interfaces for props
interface ComponentProps {
  title: string;
  onAction: () => void;
}

// Use explicit return types for complex functions
function processData(input: string): ProcessedData {
  // ...
}

// Avoid 'any' - use proper types or 'unknown'
// Bad:  const data: any = response;
// Good: const data: ApiResponse = response;
```

### Styling Guidelines

```typescript
// Use Tailwind utility classes
<div className="flex items-center gap-4 p-6 rounded-lg bg-card">

// Use cn() helper for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "base-class",
  isActive && "active-class",
  variant === "primary" && "primary-class"
)}>

// Define reusable class strings
const cardStyles = "ios-card p-6 rounded-2xl shadow-lg";
```

---

## 🗄️ State Management

### Zustand Store (`fishtankStore`)

Global application state for cross-cutting concerns:

```typescript
import { useFishtankStore } from "@/store/fishtankStore";

function MyComponent() {
  const { isLoading, error, loadInitialData } = useFishtankStore();
  
  // Use state and actions
}
```

### React Context

- **AuthContext**: Authentication state and user data
- **NavigationContext**: Navigation history and bottom nav state

### TanStack Query

For server state and data fetching (when backend is integrated):

```typescript
import { useQuery } from "@tanstack/react-query";

const { data, isLoading, error } = useQuery({
  queryKey: ['startups'],
  queryFn: fetchStartups,
});
```

---

## 🔌 Backend Integration (Ready)

The application is **prepared for backend integration** with Supabase:

### Current State

- **Mock Data**: Stored in `src/data/` directory
- **Supabase Client**: Configured in `src/integrations/supabase/`
- **Types**: Database types defined in `src/integrations/supabase/types.ts`
- **Auth Context**: Ready for real authentication

### Next Steps for Integration

1. **Set up Supabase project**
   - Create tables matching the type definitions
   - Configure authentication providers
   - Set up Row Level Security (RLS)

2. **Replace mock data with API calls**
   - Convert data fetching to Supabase queries
   - Implement TanStack Query for caching
   - Add error handling and loading states

3. **Enable authentication**
   - Connect AuthContext to Supabase Auth
   - Implement login/signup flows
   - Add session management

4. **Add real-time features**
   - Messaging with Supabase Realtime
   - Live notifications
   - Collaborative editing

---

## 🧪 Testing Strategy

### Current Testing Setup

- **TypeScript**: Static type checking with `tsc`
- **ESLint**: Code quality and consistency
- **Build Verification**: Production build testing
- **Manual Testing**: Smoke tests for each persona

### Verification Commands

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Full verification
npm run verify

# Dependency analysis
npm run analyze:circular
npm run analyze:unused
```

### Testing Checklist

Before deploying:
- [ ] All three personas load without errors
- [ ] Navigation works correctly between pages
- [ ] Forms validate and submit properly
- [ ] Mobile responsive design functions
- [ ] No console errors in browser
- [ ] Production build succeeds
- [ ] No circular dependencies

---

## 📊 Code Quality Metrics

### Current Status (October 2025)

- ✅ **Build Status**: Passing (Vite build succeeds)
- ✅ **Circular Dependencies**: None detected (400+ files analyzed)
- ✅ **Bundle Size**: Optimized with code splitting
- ⚠️ **TypeScript Warnings**: ~150 unused imports (non-blocking)
- ⚠️ **Type Safety**: ~30 implicit 'any' types (to be addressed)

### Maintenance Tools

```bash
# Generate dependency graph
npm run analyze:graph
# Output: var/deps-graph.svg

# Find unused exports
npm run analyze:unused
# Output: var/unused-exports.log

# Check for circular dependencies
npm run analyze:circular
# Output: var/circular-deps.log
```

---

## 🚢 Deployment

### Production Build

```bash
# Build the application
npm run build

# Output directory: dist/
# - Optimized JavaScript bundles
# - Minified CSS
# - Optimized assets
# - Source maps for debugging
```

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
# Supabase (when integrated)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Other configurations
VITE_APP_ENV=production
```

### Hosting Recommendations

- **Vercel**: Optimized for Vite/React apps
- **Netlify**: Simple deployment with git integration
- **AWS Amplify**: Full AWS integration
- **Cloudflare Pages**: Fast global CDN

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Production build tested locally (`npm run preview`)
- [ ] Source maps generated for debugging
- [ ] Analytics tracking set up
- [ ] Error monitoring configured (e.g., Sentry)
- [ ] CDN configured for assets
- [ ] HTTPS enabled
- [ ] Custom domain configured

---

## 🔍 Troubleshooting

### Common Issues

**Issue**: TypeScript errors but build succeeds
- **Cause**: Vite is more lenient than `tsc`
- **Solution**: Run `npm run typecheck` to see all type errors

**Issue**: Import errors for @/ path alias
- **Cause**: IDE not recognizing path alias
- **Solution**: Restart TypeScript server in your IDE

**Issue**: Build fails with memory errors
- **Cause**: Large bundle size
- **Solution**: Increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096 npm run build`

**Issue**: Hot reload not working
- **Cause**: File watchers limit exceeded
- **Solution**: Increase file watcher limit on Linux/Mac

---

## 📝 Recent Changes & Migration

### October 2025 - Codebase Cleanup

- Removed 40+ duplicate files and folders
- Cleaned up old migration scripts
- Archived historical documentation
- Verified zero circular dependencies
- Optimized build pipeline

### Key Improvements

- Single unified codebase (down from 4 separate apps)
- Consistent component architecture
- Improved type safety
- Better developer experience
- Comprehensive documentation

See `CLEANUP_SUMMARY.md` and `REFACTOR_NOTES.md` for detailed migration notes.

---

## 🤝 Contributing

### Code Style

- Use TypeScript for all new code
- Follow existing file organization patterns
- Use Tailwind CSS for styling
- Avoid inline styles
- Write descriptive commit messages

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push and create pull request
git push origin feature/your-feature-name
```

### Commit Message Convention

```
feat: Add new feature
fix: Fix bug in component
docs: Update documentation
style: Format code
refactor: Refactor component
test: Add tests
chore: Update dependencies
```

---

## 📚 Additional Resources

### Documentation Files

- `REFACTOR_NOTES.md` - Detailed refactoring decisions
- `CLEANUP_SUMMARY.md` - Recent cleanup documentation
- `DELETION_CANDIDATES.md` - Tracking deleted files

### Learning Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/latest)

---

## 🔐 Security

- Authentication ready via Supabase
- Protected routes implemented
- Environment variables for sensitive data
- HTTPS required in production
- Regular dependency updates

---

## 📄 License

**Private** - © 2025 Fishtank App INC.

All rights reserved. This is proprietary software.

---

## 👥 Support

For questions or issues:
1. Check this README
2. Review `REFACTOR_NOTES.md`
3. Check git commit history
4. Contact the development team

---

## 🎉 Acknowledgments

Built with ❤️ using modern web technologies:
- React Team for React 18
- Vercel for Next.js patterns and inspiration
- shadcn for the excellent UI component library
- The open-source community

---

**Last Updated**: October 2025  
**Version**: 1.0.0  
**Status**: Production Ready
