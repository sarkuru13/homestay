/*
  # Add Vendor System with Verification

  1. New Tables
    - `vendors`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text)
      - `is_verified` (boolean, default false)
      - `created_at` (timestamp)
    - `bookings`
      - `id` (uuid, primary key)
      - `accommodation_id` (uuid, foreign key)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `check_in_date` (date)
      - `check_out_date` (date)
      - `guests_count` (integer)
      - `status` (enum: pending, confirmed, cancelled)
      - `booking_reference` (text, unique)
      - `created_at` (timestamp)

  2. Schema Changes
    - Add `vendor_id` to accommodations table
    - Add `is_verified` to accommodations table
    - Add `exact_address` to accommodations table (hidden until booking)

  3. Security
    - Enable RLS on all new tables
    - Add policies for vendors and bookings
    - Update accommodation policies for verification
*/

-- Create vendor status enum
CREATE TYPE vendor_status AS ENUM ('pending', 'verified', 'rejected');

-- Create booking status enum
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');

-- Create vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  phone text NOT NULL,
  status vendor_status DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  accommodation_id uuid NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  check_in_date date NOT NULL,
  check_out_date date NOT NULL,
  guests_count integer NOT NULL DEFAULT 1,
  status booking_status DEFAULT 'pending',
  booking_reference text UNIQUE NOT NULL DEFAULT 'BK' || EXTRACT(EPOCH FROM now())::text,
  total_amount numeric(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add vendor_id to accommodations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accommodations' AND column_name = 'vendor_id'
  ) THEN
    ALTER TABLE accommodations ADD COLUMN vendor_id uuid;
  END IF;
END $$;

-- Add is_verified to accommodations
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accommodations' AND column_name = 'is_verified'
  ) THEN
    ALTER TABLE accommodations ADD COLUMN is_verified boolean DEFAULT false;
  END IF;
END $$;

-- Add exact_address to accommodations (hidden until booking)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'accommodations' AND column_name = 'exact_address'
  ) THEN
    ALTER TABLE accommodations ADD COLUMN exact_address text DEFAULT '';
  END IF;
END $$;

-- Add foreign key constraint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'accommodations_vendor_id_fkey'
  ) THEN
    ALTER TABLE accommodations 
    ADD CONSTRAINT accommodations_vendor_id_fkey 
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Add foreign key constraint for bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'bookings_accommodation_id_fkey'
  ) THEN
    ALTER TABLE bookings 
    ADD CONSTRAINT bookings_accommodation_id_fkey 
    FOREIGN KEY (accommodation_id) REFERENCES accommodations(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Vendor policies
CREATE POLICY "Vendors can read own data"
  ON vendors
  FOR SELECT
  TO authenticated
  USING (auth.email() = email);

CREATE POLICY "Anyone can create vendor account"
  ON vendors
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.email() = email);

CREATE POLICY "Vendors can update own data"
  ON vendors
  FOR UPDATE
  TO authenticated
  USING (auth.email() = email);

CREATE POLICY "Admins can manage all vendors"
  ON vendors
  FOR ALL
  TO authenticated
  USING (auth.email() IN ('admin@karbianglong.com'));

-- Booking policies
CREATE POLICY "Anyone can create bookings"
  ON bookings
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Vendors can view their accommodation bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    accommodation_id IN (
      SELECT id FROM accommodations 
      WHERE vendor_id IN (
        SELECT id FROM vendors WHERE email = auth.email()
      )
    )
  );

CREATE POLICY "Admins can manage all bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (auth.email() IN ('admin@karbianglong.com'));

-- Update accommodation policies for verification
DROP POLICY IF EXISTS "Anyone can view accommodations" ON accommodations;
CREATE POLICY "Anyone can view verified accommodations"
  ON accommodations
  FOR SELECT
  TO public
  USING (is_verified = true);

CREATE POLICY "Vendors can view own accommodations"
  ON accommodations
  FOR SELECT
  TO authenticated
  USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE email = auth.email()
    )
  );

CREATE POLICY "Vendors can insert own accommodations"
  ON accommodations
  FOR INSERT
  TO authenticated
  WITH CHECK (
    vendor_id IN (
      SELECT id FROM vendors WHERE email = auth.email()
    )
  );

CREATE POLICY "Vendors can update own accommodations"
  ON accommodations
  FOR UPDATE
  TO authenticated
  USING (
    vendor_id IN (
      SELECT id FROM vendors WHERE email = auth.email()
    )
  );

-- Create update triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();