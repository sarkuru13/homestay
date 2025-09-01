import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBookings } from '../hooks/useBookings';
import { MapPin, Phone, User, Calendar, Users, ExternalLink, ArrowLeft } from 'lucide-react';

export function BookingDetails() {
  const { reference } = useParams<{ reference: string }>();
  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { getBookingDetails } = useBookings();

  useEffect(() => {
    if (reference) {
      loadBookingDetails();
    }
  }, [reference]);

  const loadBookingDetails = async () => {
    try {
      const data = await getBookingDetails(reference!);
      setBooking(data);
    } catch (error) {
      setError('Booking not found or not confirmed yet.');
    } finally {
      setLoading(false);
    }
  };

  const openInMaps = () => {
    if (booking?.accommodations?.latitude && booking?.accommodations?.longitude) {
      const url = `https://www.google.com/maps?q=${booking.accommodations.latitude},${booking.accommodations.longitude}`;
      window.open(url, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <span className="ml-2 text-gray-600">Loading booking details...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
          <p className="text-gray-600 mb-6">
            {error || 'The booking reference you provided is invalid or the booking is not confirmed yet.'}
          </p>
          <Link
            to="/"
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-emerald-600 text-white p-6">
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed</h1>
            <p className="text-emerald-100">Reference: {booking.booking_reference}</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Accommodation Details */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Accommodation Details</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {booking.accommodations.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.accommodations.exact_address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a 
                      href={`tel:${booking.accommodations.contact_number}`}
                      className="text-emerald-600 hover:text-emerald-700"
                    >
                      {booking.accommodations.contact_number}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Check-in</span>
                  </div>
                  <p className="text-gray-700">{new Date(booking.check_in_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Check-out</span>
                  </div>
                  <p className="text-gray-700">{new Date(booking.check_out_date).toLocaleDateString()}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-gray-600" />
                    <span className="font-medium text-gray-900">Guests</span>
                  </div>
                  <p className="text-gray-700">{booking.guests_count}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-gray-900">Total Amount</span>
                  </div>
                  <p className="text-2xl font-bold text-emerald-600">₹{booking.total_amount}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Owner Contact</h2>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{booking.accommodations.vendors?.name}</p>
                    <p className="text-gray-600">{booking.accommodations.vendors?.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`tel:${booking.accommodations.vendors?.phone}`}
                      className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Call Owner
                    </a>
                    <a
                      href={`sms:${booking.accommodations.vendors?.phone}?body=Hi, this is regarding booking ${booking.booking_reference}`}
                      className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Send SMS
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Button */}
            {booking.accommodations.latitude && booking.accommodations.longitude && (
              <div className="text-center">
                <button
                  onClick={openInMaps}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Google Maps
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}