# Supabase Database Migration Guide

## Overview
This guide helps you update your existing Supabase database to support the new email/SMS reminder collection features.

## What's New
The `agents` table now includes:
- `wants_reminders` (BOOLEAN) - Whether agent wants email/SMS reminders

Note: `email` and `phone` columns already existed in the schema.

## Migration Steps

### Option 1: Run Migration Script (Recommended)
If you have an existing database, run this in Supabase SQL Editor:

```sql
-- Add wants_reminders column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'agents' 
    AND column_name = 'wants_reminders'
  ) THEN
    ALTER TABLE public.agents ADD COLUMN wants_reminders BOOLEAN DEFAULT false;
  END IF;
END $$;
```

### Option 2: Fresh Database Setup
If starting from scratch, run the entire `supabase-schema.sql` file.

## Verification

After running the migration, verify the columns exist:

```sql
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'agents'
  AND column_name IN ('email', 'phone', 'wants_reminders')
ORDER BY column_name;
```

Expected output:
```
column_name      | data_type | column_default
-----------------+-----------+---------------
email            | text      | NULL
phone            | text      | NULL
wants_reminders  | boolean   | false
```

## Testing

After migration, test the new fields:

```sql
-- Insert test agent with reminders
INSERT INTO public.agents (
  real_name, 
  codename, 
  email, 
  phone, 
  wants_reminders, 
  attendance_status
)
VALUES (
  'Test Agent', 
  'TEST-' || gen_random_uuid()::text, 
  'test@example.com', 
  '+1234567890', 
  true, 
  'attending'
)
RETURNING id, real_name, codename, email, phone, wants_reminders;

-- Clean up test data
DELETE FROM public.agents WHERE real_name = 'Test Agent';
```

## Rollback (If Needed)

If you need to remove the new column:

```sql
ALTER TABLE public.agents DROP COLUMN IF EXISTS wants_reminders;
```

## Next Steps

1. ✅ Run migration in Supabase SQL Editor
2. ✅ Verify columns exist
3. ✅ Test with sample insert
4. ✅ Deploy frontend changes (already done in commit 8380296)
5. ✅ Test full registration flow in production

## Support

If you encounter issues:
1. Check Supabase logs for errors
2. Verify RLS policies allow INSERT/UPDATE on new columns
3. Confirm environment variables are set in Vercel
4. Test locally first with `npm run dev`
