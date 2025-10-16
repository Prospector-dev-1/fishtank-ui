# Supabase Setup Instructions

## Step 1: Create Environment Files

Create the following `.env` files with your Supabase credentials:

### Root Project: `.env`
```bash
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Creator App: `src/roles/creator/.env`
```bash
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Innovator App: `src/roles/innovator/.env`
```bash
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Investor App: `src/roles/investor/.env`
```bash
VITE_SUPABASE_URL=your-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 2: Get Your Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (e.g., `https://abc defg.supabase.co`)
5. Copy the **anon/public key** (starts with `eyJ...`)

## Step 3: Run Database Migrations

Once environment variables are set, run:

```bash
# This will create all tables, indexes, and RLS policies
npm run migrate:supabase
```

## Step 4: Seed Initial Data (Optional)

To populate the database with sample data:

```bash
npm run seed:supabase
```

## What Gets Created

### Database Tables (33 total)
- User profiles and role-specific tables
- Startups and team information
- Messages and notifications
- Contracts, proposals, and milestones
- Earnings and payments
- Investor interactions
- And more...

### Storage Buckets
- `avatars` - User profile pictures
- `portfolio` - Creator portfolio media
- `pitch-videos` - Startup pitch videos
- `pitch-decks` - Pitch deck PDFs
- `deliverables` - Project files
- `documents` - Legal documents
- `attachments` - Message attachments

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only access their own data
- Public content is accessible to all authenticated users
- Sensitive data (earnings, contracts) is private

### Real-time Subscriptions
- New messages
- Notifications
- Milestone updates
- Investor activity

## Security Notes

- **NEVER commit `.env` files to Git** (they're already in `.gitignore`)
- The anon key is safe to use client-side
- Service role key (if needed) should NEVER be exposed client-side
- All sensitive operations are protected by RLS policies

## Troubleshooting

### Cannot connect to Supabase
- Verify your `.env` files have the correct URL and key
- Ensure the URL starts with `https://`
- Check that your Supabase project is active

### RLS Errors
- Make sure migrations have run successfully
- Check that you're authenticated when accessing protected resources
- Verify RLS policies match your use case

### Migration Errors
- Ensure you have the latest Supabase CLI: `npm install -g supabase`
- Try running migrations manually: `supabase db push`

## Next Steps

After setup:
1. Authentication will be fully functional
2. All mock data will be replaced with real database queries
3. Real-time features will be enabled
4. File uploads will work through Supabase Storage

---

For detailed schema information, see `DATABASE_SCHEMA.md`

