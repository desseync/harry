/*
  # Add phone number fields to user profiles

  1. Changes
    - Add phone_number column to auth.users
    - Add sms_opt_in column to auth.users
    - Add phone number validation check

  2. Security
    - No changes to RLS policies required (using built-in auth.users table)
*/

-- Add phone_number and sms_opt_in columns to auth.users if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'auth' 
    AND table_name = 'users' 
    AND column_name = 'phone_number'
  ) THEN
    ALTER TABLE auth.users 
      ADD COLUMN phone_number text,
      ADD COLUMN sms_opt_in boolean DEFAULT false,
      ADD CONSTRAINT valid_phone_number 
        CHECK (
          phone_number IS NULL OR 
          phone_number ~ '^\+1-[0-9]{3}-[0-9]{3}-[0-9]{4}$'
        );
  END IF;
END $$;