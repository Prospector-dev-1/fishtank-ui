Unified App

This repository merges three role-specific UIs (Creator, Innovator, Investor) into a single app with role-based routing and a shared Supabase backend, following master_manifest.json.

Quickstart
1) Install: pnpm i (or npm i / yarn)
2) Env: copy .env.example to .env and set your Supabase keys.
3) Run: pnpm dev
4) First visit /onboarding to pick your role, then you'll be routed under /creator, /innovator, or /investor.

Env keys (from manifest env_matrix)
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_SUPABASE_URL
- SUPABASE_SERVICE_KEY
- VITE_SUPABASE_PROJECT_ID
- VITE_SUPABASE_PUBLISHABLE_KEY
- VITE_SUPABASE_URL

Routing
- Public: /, /onboarding
- Protected (placeholder guard): /app/*, /creator/*, /innovator/*, /investor/*

Notes
- Each original UI is copied under src/roles/<role>.
- You may need to reconcile internal imports or duplicated file names within those packages depending on how they reference absolute paths.
- See conflict_report.txt for filename collisions (by basename) across roles.
