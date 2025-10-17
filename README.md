# Fishtank - Unified Application

A unified mobile-first platform connecting creators, innovators, and investors.

> **✨ Recently Unified**: October 2025 - Consolidated from 4 separate apps into ONE single application.

## 🏗️ Architecture

```
fishtank-unified/
├── src/
│   ├── pages/
│   │   ├── onboarding/          # Role selection landing
│   │   ├── creator/             # Creator pages
│   │   ├── innovator/           # Innovator pages
│   │   └── investor/            # Investor pages
│   │
│   ├── components/
│   │   ├── ui/                  # Shared UI components (buttons, cards, etc.)
│   │   ├── creator/             # Creator-specific components
│   │   ├── innovator/           # Innovator-specific components
│   │   └── investor/            # Investor-specific components
│   │
│   ├── lib/                     # Utility functions by role
│   ├── hooks/                   # React hooks by role
│   ├── contexts/                # React contexts
│   ├── store/                   # State management (Zustand)
│   ├── data/                    # Mock data
│   ├── types/                   # TypeScript types
│   ├── integrations/            # Third-party integrations (Supabase)
│   ├── assets/                  # Images and static files
│   │
│   ├── App.tsx                  # Main app router
│   ├── main.tsx                 # Entry point
│   └── index.css               # Global styles
│
├── public/                      # Static assets
├── index.html                   # HTML entry point
├── vite.config.ts              # Vite configuration
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
└── package.json                # Dependencies and scripts
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install all dependencies
npm install
```

### Development

```bash
# Run the unified app (single dev server, single port!)
npm run dev
```

The app will be available at **http://localhost:5173**

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🎯 How It Works

### Single Application, Multiple Roles

This is now a **truly unified application** that runs on a single dev server. All three role interfaces (Creator, Innovator, Investor) are part of ONE codebase.

### Routes

- `/` - Onboarding/Role selection
- `/creator/*` - All creator pages
- `/innovator/*` - All innovator pages
- `/investor/*` - All investor pages

### Navigation Flow

1. User lands on `/` (onboarding page)
2. Selects their role (Creator, Innovator, or Investor)
3. React Router navigates to the appropriate route within the same app
4. No page reloads, no separate servers, just smooth SPA navigation

## 📱 Features by Role

### Creator Interface (`/creator/`)
- Portfolio showcase
- Project discovery
- Team collaboration
- Earnings tracking
- Proposals and contracts

### Innovator Interface (`/innovator/`)
- Pitch creation with video
- Team management
- Collaboration tools
- Analytics dashboard
- NDA requests

### Investor Interface (`/investor/`)
- Startup discovery (Tinder-style swipe)
- Deal flow management
- Market intelligence
- Portfolio tracking
- Due diligence tools

## 🛠️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Routing**: React Router 6
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query
- **Backend**: Supabase (optional)

## 🎨 UI Philosophy

- **Mobile-first**: Designed for mobile with desktop support
- **iOS-inspired**: Clean, native-feeling interfaces
- **Dark mode**: Default dark theme with system support
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: Code splitting, lazy loading

## 🔗 Benefits of Unified Architecture

✅ **Single codebase** - Easier to maintain and update
✅ **Shared components** - Reusable UI components across roles
✅ **Single build** - One deployment artifact
✅ **Faster development** - No context switching between apps
✅ **Better state management** - Can share state across roles if needed
✅ **Consistent UX** - Same look and feel everywhere
✅ **Simpler deployment** - One app to deploy, not four

## 📝 Development Tips

### Adding a New Page

```typescript
// 1. Create page component
src/pages/creator/NewPage.tsx

// 2. Add route in App.tsx
<Route path="new-page" element={<NewPage />} />
```

### Adding Shared Components

```typescript
// Place in src/components/ui/ for shared UI
src/components/ui/my-component.tsx

// Import from anywhere
import { MyComponent } from "@/components/ui/my-component";
```

### Role-Specific Code

```typescript
// Keep role-specific code in role directories
src/components/creator/CreatorCard.tsx
src/lib/creator/creatorUtils.ts
```

## 🧹 Code Quality

- ESLint configured for React and TypeScript
- Strict TypeScript settings enabled
- Tailwind CSS for consistent styling
- Component organization by role
- Path aliases (@/) for clean imports

## 📄 License

Private - © 2025 Fishtank App INC.
