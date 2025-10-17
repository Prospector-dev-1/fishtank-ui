# Fishtank Monorepo

A modern monorepo for the Fishtank platform, containing multiple applications that share a common backend and database.

## 🏗️ Architecture

```
fishtank-monorepo/
├── apps/                    # Application packages
│   ├── onboarding/         # Role selection landing page (port 5173)
│   ├── creator/            # Creator app (port 5177)
│   ├── innovator/          # Innovator app (port 5179)
│   └── investor/           # Investor app (port 5180)
│
├── packages/               # Shared packages
│   ├── shared-types/      # Shared TypeScript types
│   ├── shared-utils/      # Utility functions
│   ├── api-client/        # Backend API client
│   └── shared-ui/         # Shared React components
│
└── backend/               # Backend server (coming soon)
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

```bash
# Install all dependencies for all apps and packages
npm install
```

### Development

```bash
# Run all apps simultaneously
npm run dev

# Or run individual apps
npm run dev:onboarding   # http://localhost:5173
npm run dev:creator      # http://localhost:5177
npm run dev:innovator    # http://localhost:5179
npm run dev:investor     # http://localhost:5180
```

### Building

```bash
# Build all apps
npm run build
```

## 📦 Apps

### Onboarding App
- **Port**: 5173
- **Purpose**: Role selection landing page
- **Tech**: React, Vite, Tailwind CSS
- **Entry point**: Users start here to choose their role

### Creator App
- **Port**: 5177
- **Purpose**: Interface for freelancers and interns
- **Features**: Portfolio showcase, project discovery, collaboration tools

### Innovator App
- **Port**: 5179
- **Purpose**: Platform for idea pitching and collaboration
- **Features**: Pitch creation, video uploads, team collaboration

### Investor App
- **Port**: 5180
- **Purpose**: Deal flow and investment tracking
- **Features**: Startup discovery, due diligence, portfolio management

## 📚 Shared Packages

### @fishtank/shared-types
TypeScript types used across all applications for type consistency.

### @fishtank/shared-utils
Common utility functions (formatting, validation, etc.).

### @fishtank/api-client
Centralized API client for backend communication.

### @fishtank/shared-ui
Reusable React components shared across apps.

## 🔗 How Apps Communicate

- **Frontend**: Apps are independent but share common types and utilities
- **Backend**: All apps connect to the same backend API
- **Database**: Shared database accessed via the backend
- **Navigation**: Onboarding app redirects to appropriate role app

## 🛠️ Development Workflow

1. **Start from onboarding**: `npm run dev:onboarding`
2. **Select a role**: Navigate to http://localhost:5173
3. **Role app opens**: System redirects to the appropriate app
4. **Shared code**: Import from `@fishtank/*` packages

## 📝 Adding a New Shared Package

```bash
mkdir -p packages/my-package/src
cd packages/my-package
npm init -y
# Update package.json with proper name and exports
```

## 🤝 Contributing

- Each app is independent and can be developed separately
- Shared code goes in `packages/`
- Follow existing patterns for consistency
- Test in all relevant apps before committing

## 📄 License

Private - © 2025 Fishtank App INC.
