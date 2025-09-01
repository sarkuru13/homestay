/*
  # Create accommodations table and authentication setup

  1. New Tables
    - `accommodations`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `type` (enum: homestay, hotel)
      - `location` (text, required)
      - `latitude` (float8, for mapping)
      - `longitude` (float8, for mapping)
      - `max_capacity` (integer, required)
      - `breakfast_included` (boolean, default false)
      - `lunch_included` (boolean, default false)
      - `dinner_included` (boolean, default false)
      - `price_per_night` (numeric, required)
      - `contact_number` (text, required)
      - `images` (text array for storing image URLs)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `accommodations` table
    - Add policy for public read access (for search/listing)
    - Add policy for authenticated users to manage accommodations (admin)

  3. Storage
    - Create storage bucket for accommodation images
    - Set up policies for image upload and access
*/

-- Create enum for accommodation type
CREATE TYPE accommodation_type AS ENUM ('homestay', 'hotel');

-- Create accommodations table
CREATE TABLE IF NOT EXISTS accommodations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type accommodation_type NOT NULL,
  location text NOT NULL,
  latitude float8,
  longitude float8,
  max_capacity integer NOT NULL CHECK (max_capacity > 0),
  breakfast_included boolean DEFAULT false,
  lunch_included boolean DEFAULT false,
  dinner_included boolean DEFAULT false,
  price_per_night numeric(10,2) NOT NULL CHECK (price_per_night > 0),
  contact_number text NOT NULL,
  images text[] DEFAULT '{}',
  description text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE accommodations ENABLE ROW LEVEL SECURITY;

-- Policy for public read access (anyone can search and view accommodations)
CREATE POLICY "Anyone can view accommodations"
  ON accommodations
  FOR SELECT
  TO public
  USING (true);

-- Policy for authenticated users to insert accommodations (admins)
CREATE POLICY "Authenticated users can insert accommodations"
  ON accommodations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy for authenticated users to update accommodations (admins)
CREATE POLICY "Authenticated users can update accommodations"
  ON accommodations
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy for authenticated users to delete accommodations (admins)
CREATE POLICY "Authenticated users can delete accommodations"
  ON accommodations
  FOR DELETE
  TO authenticated
  USING (true);

-- Create storage bucket for accommodation images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('accommodation-images', 'accommodation-images', true)
ON CONFLICT (id) DO NOTHING;

-- Policy for public access to images
CREATE POLICY "Public can view accommodation images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'accommodation-images');

-- Policy for authenticated users to upload images
CREATE POLICY "Authenticated users can upload accommodation images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'accommodation-images');

-- Policy for authenticated users to update images
CREATE POLICY "Authenticated users can update accommodation images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'accommodation-images');

-- Policy for authenticated users to delete images
CREATE POLICY "Authenticated users can delete accommodation images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'accommodation-images');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_accommodations_updated_at
  BEFORE UPDATE ON accommodations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();