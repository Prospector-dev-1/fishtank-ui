#!/usr/bin/env node

/**
 * Supabase Migration Runner
 * Runs all SQL migration files in order
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // Need service key for migrations

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  console.log('\nPlease provide:');
  console.log('- VITE_SUPABASE_URL from your .env file');
  console.log('- SUPABASE_SERVICE_KEY from Supabase Dashboard → Settings → API → service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function runMigrations() {
  console.log('🚀 Starting Supabase migrations...\n');

  const migrationsDir = join(__dirname, '../supabase/migrations');
  const files = readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    console.log(`📄 Running ${file}...`);
    
    const sql = readFileSync(join(migrationsDir, file), 'utf8');
    
    // Split by statement and run each
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s && !s.startsWith('--'));

    try {
      for (const statement of statements) {
        if (statement) {
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement + ';' });
          if (error) {
            throw error;
          }
        }
      }
      console.log(`✅ ${file} completed\n`);
    } catch (error) {
      console.error(`❌ Error in ${file}:`, error.message);
      process.exit(1);
    }
  }

  console.log('🎉 All migrations completed successfully!');
}

runMigrations();

