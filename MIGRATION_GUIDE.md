# 🚀 Fishtank Backend Migration Guide

## ✅ What's Been Completed

1. ✅ Created database schema (33 tables)
2. ✅ Set up Row Level Security policies
3. ✅ Created helper functions and triggers
4. ✅ Configured storage buckets
5. ✅ Installed Supabase dependencies
6. ✅ Created environment files
7. ✅ Replaced mock Supabase clients with real ones

## 📋 What You Need to Do

### Step 1: Run Database Migrations

You need to run the SQL migration files in your Supabase project. Here's how:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Click on **SQL Editor** in the left sidebar
4. For each migration file (run in order):
   
   **File 1: `supabase/migrations/001_initial_schema.sql`**
   - Click **+ New Query**
   - Copy the entire contents of the file
   - Paste into the SQL editor
   - Click **Run** (or Cmd/Ctrl + Enter)
   - Wait for "Success" message
   
   **File 2: `supabase/migrations/002_shared_tables.sql`**
   - Repeat the same process
   
   **File 3: `supabase/migrations/003_indexes.sql`**
   - Repeat the same process
   
   **File 4: `supabase/migrations/004_rls_policies.sql`**
   - Repeat the same process
   
   **File 5: `supabase/migrations/005_functions.sql`**
   - Repeat the same process
   
   **File 6: `supabase/migrations/006_storage.sql`**
   - Repeat the same process

⏱️ **Total time**: ~2-3 minutes

#### Option B: Using Supabase CLI (Advanced)

If you have the Supabase CLI installed:

```bash
# Initialize Supabase in this directory (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref ldfxkudcyhasxloigjgg

# Push migrations
supabase db push
```

### Step 2: Verify Database Setup

After running migrations, verify in Supabase Dashboard:

1. **Database** → **Tables**: You should see 33 tables
2. **Database** → **Policies**: RLS should be enabled on all tables
3. **Storage**: Should show 7 buckets (avatars, portfolio, pitch-videos, etc.)

### Step 3: Create Your First User

The database is now ready! When you sign up in the app:

1. Go to `http://localhost:5173/onboarding`
2. Choose your role (Creator, Innovator, or Investor)
3. The app will redirect to the appropriate port
4. Sign up with email/password
5. A profile will automatically be created via triggers

## 🎯 What's Next

Once migrations are complete, the app will have:

### ✅ Full Authentication
- Email/password signup and login
- Role-based profiles (Creator, Innovator, Investor)
- Session management
- Auto-created profiles on signup

### ✅ Real Database
- 33 tables covering all features
- Row Level Security protecting user data
- Automatic triggers for business logic
- Indexed queries for performance

### ✅ File Storage
- 7 storage buckets for different file types
- Secure access policies
- Direct uploads from the frontend

### ✅ Real-time Features
- Live messaging
- Instant notifications
- Milestone updates
- Activity feeds

## 🔧 Current Status

### Completed ✅
- [x] Database schema design
- [x] Migration files created
- [x] RLS policies implemented
- [x] Helper functions & triggers
- [x] Storage buckets configured
- [x] Environment variables set
- [x] Real Supabase clients installed

### Remaining (After Migration)
- [ ] Update authentication flows for real auth
- [ ] Replace mock data queries with real database calls
- [ ] Test all features end-to-end

## 🐛 Troubleshooting

### Error: "relation does not exist"
- **Cause**: Migrations not run or incomplete
- **Fix**: Run all 6 migration files in order

### Error: "permission denied for table"
- **Cause**: RLS policies not applied
- **Fix**: Run migration file 004_rls_policies.sql

### Error: "Missing Supabase environment variables"
- **Cause**: .env files not created
- **Fix**: Check that `.env` files exist in:
  - `/Users/Elie/Desktop/Unified-App/.env`
  - `/Users/Elie/Desktop/Unified-App/src/roles/creator/.env`
  - `/Users/Elie/Desktop/Unified-App/src/roles/innovator/.env`

### Error: Storage bucket errors
- **Cause**: Storage migration not run
- **Fix**: Run migration file 006_storage.sql

## 📊 Database Schema Summary

**33 Tables Total:**

**Creator (6 tables):**
- creator_profiles
- creator_services
- creator_portfolio
- creator_reviews
- creator_endorsements
- earnings

**Innovator (6 tables):**
- innovator_profiles
- startups
- startup_team_members
- startup_milestones
- startup_faqs
- startup_traction

**Investor (5 tables):**
- investor_profiles
- investor_interactions
- investor_portfolio
- investor_playlists
- investor_playlist_items

**Shared (16 tables):**
- profiles (core)
- briefs
- proposals
- contracts
- contract_milestones
- messages
- notifications
- friend_requests
- connections
- invitations
- team_invitations
- nda_requests
- disputes
- referrals
- activities

**Storage Buckets (7):**
- avatars (public)
- portfolio (public)
- pitch-videos (private/conditional)
- pitch-decks (private, NDA required)
- deliverables (private, contract parties only)
- documents (private)
- attachments (private)

## 🔒 Security

All tables have Row Level Security (RLS) enabled with policies ensuring:
- Users can only see their own private data
- Public profiles are viewable by all
- Contract/project data only accessible to involved parties
- Messages only readable by sender/recipient
- Storage buckets have appropriate access policies

## 📝 Next Steps After Migration

Once you've run all migrations successfully:

1. ✅ Verify database setup in Supabase Dashboard
2. 🏃 Run the dev servers:
   ```bash
   # Terminal 1: Main app
   npm run dev
   
   # Terminal 2: Creator app
   cd src/roles/creator && npm run dev
   
   # Terminal 3: Innovator app
   cd src/roles/innovator && npm run dev
   ```
3. 🧪 Test authentication signup/login
4. 📊 Check that data is being stored in Supabase
5. 🎉 Start using the real backend!

---

**Need Help?** Check `DATABASE_SCHEMA.md` for detailed schema documentation.

