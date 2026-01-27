/*
  # Create waitlist table for Sovan landing page

  1. New Tables
    - `waitlist`
      - `id` (uuid, primary key) - Unique identifier for each signup
      - `email` (text, unique, not null) - Email address of the user
      - `created_at` (timestamptz) - Timestamp of when the user signed up
      - `status` (text) - Status of the waitlist entry (pending, contacted, etc.)
  
  2. Security
    - Enable RLS on `waitlist` table
    - Add policy to allow anyone to insert their email (public signup)
    - Add policy for authenticated admins to view all entries
  
  3. Important Notes
    - Email field has unique constraint to prevent duplicate signups
    - Default status is 'pending'
    - Timestamps are automatically set to current time on insert
*/

CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text DEFAULT 'pending'
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can sign up for waitlist"
  ON waitlist
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view waitlist"
  ON waitlist
  FOR SELECT
  TO authenticated
  USING (true);