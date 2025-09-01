export type AccommodationType = 'homestay' | 'hotel';
export type VendorStatus = 'pending' | 'verified' | 'rejected';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Accommodation {
  id: string;
  name: string;
  type: AccommodationType;
  location: string;
  latitude?: number;
  longitude?: number;
  max_capacity: number;
  breakfast_included: boolean;
  lunch_included: boolean;
  dinner_included: boolean;
  price_per_night: number;
  contact_number: string;
  images: string[];
  description: string;
  vendor_id?: string;
  is_verified: boolean;
  exact_address: string;
  created_at?: string;
  updated_at?: string;
}

export interface Vendor {
  id: string;
  email: string;
  name: string;
  phone: string;
  status: VendorStatus;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  accommodation_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  check_in_date: string;
  check_out_date: string;
  guests_count: number;
  status: BookingStatus;
  booking_reference: string;
  total_amount: number;
  created_at?: string;
  updated_at?: string;
}

export interface SearchFilters {
  location: string;
  type?: AccommodationType;
  maxCapacity?: number;
  breakfastIncluded?: boolean;
  lunchIncluded?: boolean;
  dinnerIncluded?: boolean;
}

export interface Database {
  public: {
    Tables: {
      accommodations: {
        Row: Accommodation;
        Insert: Omit<Accommodation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Accommodation, 'id' | 'created_at' | 'updated_at'>>;
      };
      vendors: {
        Row: Vendor;
        Insert: Omit<Vendor, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Vendor, 'id' | 'created_at' | 'updated_at'>>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'booking_reference'>;
        Update: Partial<Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'booking_reference'>>;
      };
    };
  };
}