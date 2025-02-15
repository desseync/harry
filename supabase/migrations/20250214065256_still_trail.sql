/*
  # Create User Metrics System

  1. New Tables
    - `user_metrics`
      - `id` (uuid, primary key)
      - `user_id` (uuid, unique, references auth.users)
      - `completion_rate` (numeric)
      - `time_saved` (numeric)
      - `revenue_gained` (numeric)
      - `last_updated` (timestamptz)

  2. Security
    - Enable RLS on `user_metrics` table
    - Add policy for users to read their own metrics
    - Add policy for system to update metrics

  3. Functions
    - Create function to calculate and update metrics
*/

-- Create user_metrics table
CREATE TABLE IF NOT EXISTS user_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  completion_rate numeric NOT NULL DEFAULT 0,
  time_saved numeric NOT NULL DEFAULT 0,
  revenue_gained numeric NOT NULL DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  
  CONSTRAINT user_metrics_user_id_key UNIQUE (user_id),
  CONSTRAINT valid_completion_rate CHECK (completion_rate >= 0 AND completion_rate <= 100),
  CONSTRAINT valid_time_saved CHECK (time_saved >= 0),
  CONSTRAINT valid_revenue_gained CHECK (revenue_gained >= 0)
);

-- Enable Row Level Security
ALTER TABLE user_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read their own metrics"
  ON user_metrics
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "System can update metrics"
  ON user_metrics
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to calculate metrics
CREATE OR REPLACE FUNCTION calculate_user_metrics(user_uuid uuid)
RETURNS void AS $$
DECLARE
  total_appointments integer;
  completed_appointments integer;
  completion_rate_value numeric;
  time_saved_value numeric;
  revenue_gained_value numeric;
BEGIN
  -- Get total and completed appointments
  SELECT 
    COUNT(*),
    COUNT(*) FILTER (WHERE status = 'confirmed')
  INTO 
    total_appointments,
    completed_appointments
  FROM appointments
  WHERE user_id = user_uuid
  AND appointment_time >= NOW() - INTERVAL '30 days';

  -- Calculate completion rate
  IF total_appointments > 0 THEN
    completion_rate_value := (completed_appointments::numeric / total_appointments::numeric) * 100;
  ELSE
    completion_rate_value := 0;
  END IF;

  -- Calculate time saved (15 minutes per appointment)
  time_saved_value := (total_appointments * 15.0) / 60.0;

  -- Calculate revenue gained ($50 per completed appointment)
  revenue_gained_value := completed_appointments * 50;

  -- Insert or update metrics
  INSERT INTO user_metrics (
    user_id,
    completion_rate,
    time_saved,
    revenue_gained,
    last_updated
  )
  VALUES (
    user_uuid,
    completion_rate_value,
    time_saved_value,
    revenue_gained_value,
    now()
  )
  ON CONFLICT (user_id) DO UPDATE
  SET
    completion_rate = EXCLUDED.completion_rate,
    time_saved = EXCLUDED.time_saved,
    revenue_gained = EXCLUDED.revenue_gained,
    last_updated = EXCLUDED.last_updated;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update metrics when appointments change
CREATE OR REPLACE FUNCTION update_metrics_on_appointment_change()
RETURNS trigger AS $$
BEGIN
  PERFORM calculate_user_metrics(
    CASE
      WHEN TG_OP = 'DELETE' THEN OLD.user_id
      ELSE NEW.user_id
    END
  );
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add trigger to appointments table
DROP TRIGGER IF EXISTS appointment_metrics_trigger ON appointments;
CREATE TRIGGER appointment_metrics_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_metrics_on_appointment_change();

-- Calculate initial metrics for all users
DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM auth.users
  LOOP
    PERFORM calculate_user_metrics(user_record.id);
  END LOOP;
END $$;