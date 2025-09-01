import { useState } from 'react';
import { X, Calendar, Users, Phone, Mail, User } from 'lucide-react';
import { useBookings } from '../hooks/useBookings';
import { Accommodation } from '../types/accommodation';

interface BookingModalProps {
  accommodation: Accommodation;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess: (bookingReference: string) => void;
}

export function BookingModal({ accommodation, isOpen, onClose, onBookingSuccess }: BookingModalProps) {
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    check_in_date: '',
    check_out_date: '',
    guests_count: 1,
  });
  const [loading, setLoading] = useState(false);
  const { createBooking } = useBookings();

  if (!isOpen) return null;

  const calculateTotalAmount = () => {
    if (!formData.check_in_date || !formData.check_out_date) return 0;
    
    const checkIn = new Date(formData.check_in_date);
    const checkOut = new Date(formData.check_out_date);
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    
    return Math.max(0, nights * accommodation.price_per_night);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const totalAmount = calculateTotalAmount();
      const booking = await createBooking({
        accommodation_id: accommodation.id,
        ...formData,
        total_amount: totalAmount,
      });
      
      onBookingSuccess(booking.booking_reference);
      onClose();
    } catch (error) {
      alert('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const totalAmount = calculateTotalAmount();
  const nights = formData.check_in_date && formData.check_out_date 
    ? Math.max(0, Math.ceil((new Date(formData.check_out_date).getTime() - new Date(formData.check_in_date).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Book {accommodation.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">{accommodation.name}</h3>
            <p className="text-gray-600 text-sm">{accommodation.location}</p>
            <p className="text-emerald-600 font-semibold">₹{accommodation.price_per_night} per night</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline h-4 w-4 mr-1" />
                Full Name *
              </label>
              <input
                type="text"
                value={formData.customer_name}
                onChange={(e) => updateField('customer_name', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline h-4 w-4 mr-1" />
                Email Address *
              </label>
              <input
                type="email"
                value={formData.customer_email}
                onChange={(e) => updateField('customer_email', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone className="inline h-4 w-4 mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              value={formData.customer_phone}
              onChange={(e) => updateField('customer_phone', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="+91-9876543210"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Check-in Date *
              </label>
              <input
                type="date"
                value={formData.check_in_date}
                onChange={(e) => updateField('check_in_date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="inline h-4 w-4 mr-1" />
                Check-out Date *
              </label>
              <input
                type="date"
                value={formData.check_out_date}
                onChange={(e) => updateField('check_out_date', e.target.value)}
                min={formData.check_in_date || new Date().toISOString().split('T')[0]}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Users className="inline h-4 w-4 mr-1" />
                Guests *
              </label>
              <input
                type="number"
                min="1"
                max={accommodation.max_capacity}
                value={formData.guests_count}
                onChange={(e) => updateField('guests_count', parseInt(e.target.value))}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {totalAmount > 0 && (
            <div className="bg-emerald-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-700">₹{accommodation.price_per_night} × {nights} nights</span>
                <span className="font-semibold">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold text-emerald-700">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> After booking confirmation, you'll receive the exact address and contact details via email. 
              The accommodation owner will contact you to confirm your booking.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || totalAmount <= 0}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? 'Creating Booking...' : `Book Now - ₹${totalAmount}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}