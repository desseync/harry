/*
  # Create appointments table

  1. New Tables
    - `appointments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `appointment_time` (timestamptz)
      - `status` (text)
      - `type` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `appointments` table
    - Add policies for authenticated users to:
      - Read their own appointments
      - Create appointments
      - Update their own appointments
      - Delete their own appointments
*/

-- Create appointments table if it doesn't exist
CREATE TABLE IF NOT EXISTS appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  appointment_time timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  type text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),

  -- Add constraint to validate status values
  CONSTRAINT valid_status CHECK (status IN ('pending', 'confirmed', 'cancelled', 'in_progress'))
);

-- Enable RLS if not already enabled
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename = 'appointments' 
    AND rowsecurity = true
  ) THEN
    ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
  END IF;
END $$;

-- Create policies if they don't exist
DO $$ 
BEGIN
  -- Read policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointments' 
    AND policyname = 'Users can read own appointments'
  ) THEN
    CREATE POLICY "Users can read own appointments"
      ON appointments
      FOR SELECT
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;

  -- Insert policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointments' 
    AND policyname = 'Users can create appointments'
  ) THEN
    CREATE POLICY "Users can create appointments"
      ON appointments
      FOR INSERT
      TO authenticated
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Update policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointments' 
    AND policyname = 'Users can update own appointments'
  ) THEN
    CREATE POLICY "Users can update own appointments"
      ON appointments
      FOR UPDATE
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Delete policy
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'appointments' 
    AND policyname = 'Users can delete own appointments'
  ) THEN
    CREATE POLICY "Users can delete own appointments"
      ON appointments
      FOR DELETE
      TO authenticated
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop the trigger if it exists and create it again
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE
  ON appointments
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at_column();