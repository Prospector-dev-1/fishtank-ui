-- Add missing enum values to permission_level
ALTER TYPE permission_level ADD VALUE IF NOT EXISTS 'founder';
ALTER TYPE permission_level ADD VALUE IF NOT EXISTS 'co_founder';