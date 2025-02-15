/*
  # Fix GitHub API integration

  1. Changes
    - Add GitHub integration settings table
    - Add RLS policies for secure access
    - Add validation constraints

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create GitHub integration settings table
CREATE TABLE IF NOT EXISTS github_integration_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  access_token text,
  repository_url text,
  webhook_secret text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT github_settings_user_unique UNIQUE (user_id)
);

-- Enable RLS
ALTER TABLE github_integration_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can manage their own GitHub settings"
  ON github_integration_settings
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_github_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_github_settings_timestamp
  BEFORE UPDATE
  ON github_integration_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_github_settings_updated_at();