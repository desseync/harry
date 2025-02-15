/*
  # Create contact submissions table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key)
      - `first_name` (text, required)
      - `last_name` (text, required)
      - `email` (text, required)
      - `phone_number` (text, required)
      - `website` (text, optional)
      - `message` (text, required)
      - `created_at` (timestamptz, default: now())

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for authenticated users to read submissions
    - Add policy for anon/authenticated users to insert submissions
*/

-- Create the contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone_number text NOT NULL,
  website text,
  message text NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- Add constraints for validation
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_phone CHECK (phone_number ~* '^\d{3}-\d{3}-\d{4}$'),
  CONSTRAINT valid_website CHECK (
    website IS NULL OR 
    website ~* '^https?://.+'
  )
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for inserting submissions (allow anyone to submit)
CREATE POLICY "Allow anyone to submit contact form"
  ON contact_submissions
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Create policy for reading submissions (only authenticated users)
CREATE POLICY "Allow authenticated users to read submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);