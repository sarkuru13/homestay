import { useState, useEffect } from 'react';
import { useAccommodations } from '../hooks/useAccommodations';
import { useVendors } from '../hooks/useVendors';
import { useBookings } from '../hooks/useBookings';
import { AccommodationForm } from '../components/AccommodationForm';
import { AdminAccommodationCard } from '../components/AdminAccommodationCard';
import { Accommodation, Vendor, Booking } from '../types/accommodation';
import { Plus, Search, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export function Admin() {
  const [showForm, setShowForm] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'accommodations' | 'vendors' | 'bookings'>('accommodations');

  const { accommodations, loading, fetchAllAccommodations, deleteAccommodation, verifyAccommodation } = useAccommodations();
  const { vendors, fetchVendors, updateVendorStatus } = useVendors();
  const { bookings, fetchBookings, updateBookingStatus } = useBookings();

  useEffect(() => {
    fetchAllAccommodations();
    fetchVendors();
    fetchBookings();
  }, []);

  const filteredAccommodations = accommodations.filter(acc =>
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    acc.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (accommodation: Accommodation) => {
    setEditingAccommodation(accommodation);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this accommodation?')) {
      try {
        await deleteAccommodation(id);
        fetchAllAccommodations();
      } catch (error) {
        alert('Failed to delete accommodation');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAccommodation(null);
    fetchAllAccommodations();
  };

  const handleVerifyAccommodation = async (id: string, isVerified: boolean) => {
    try {
      await verifyAccommodation(id, isVerified);
      fetchAllAccommodations();
    } catch (error) {
      alert('Failed to update verification status');
    }
  };

  const handleVendorStatusUpdate = async (id: string, status: Vendor['status']) => {
    try {
      await updateVendorStatus(id, status);
      fetchVendors();
    } catch (error) {
      alert('Failed to update vendor status');
    }
  };

  const handleBookingStatusUpdate = async (id: string, status: Booking['status']) => {
    try {
      await updateBookingStatus(id, status);
      fetchBookings();
    } catch (error) {
      alert('Failed to update booking status');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage accommodations in Karbi Anglong</p>
          </div>
          {activeTab === 'accommodations' && (
            <button
              onClick={() => setShowForm(true)}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="h-5 w-5" />
              Add Accommodation
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('accommodations')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'accommodations'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Accommodations
          </button>
          <button
            onClick={() => setActiveTab('vendors')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'vendors'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Vendors
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'bookings'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Bookings
          </button>
        </div>

        {/* Accommodations Tab */}
        {activeTab === 'accommodations' && (
          <>
            {/* Search */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search accommodations..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-gray-900">{accommodations.length}</div>
                <div className="text-gray-600">Total Accommodations</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {accommodations.filter(acc => acc.is_verified).length}
                </div>
                <div className="text-gray-600">Verified</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-amber-600">
                  {accommodations.filter(acc => !acc.is_verified).length}
                </div>
                <div className="text-gray-600">Pending</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-blue-600">
                  {accommodations.filter(acc => acc.type === 'hotel').length}
                </div>
                <div className="text-gray-600">Hotels</div>
              </div>
            </div>

            {/* Accommodations List */}
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                <span className="ml-2 text-gray-600">Loading accommodations...</span>
              </div>
            ) : filteredAccommodations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccommodations.map((accommodation) => (
                  <div key={accommodation.id} className="relative">
                    <AdminAccommodationCard
                      accommodation={accommodation}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                    <div className="absolute top-2 left-2 flex gap-2">
                      {accommodation.is_verified ? (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          Verified
                        </span>
                      ) : (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleVerifyAccommodation(accommodation.id, true)}
                            className="bg-green-600 text-white p-1 rounded-full hover:bg-green-700 transition-colors"
                            title="Verify"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => handleVerifyAccommodation(accommodation.id, false)}
                            className="bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                            title="Reject"
                          >
                            <XCircle className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
                <div className="text-center py-12">
                    <div className="text-gray-500 mb-4">No accommodations found</div>
                    <button
                    onClick={() => setShowForm(true)}
                    className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                    Add First Accommodation
                    </button>
                </div>
            )}
          </>
        )}

        {/* Vendors Tab */}
        {activeTab === 'vendors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {vendors.filter(v => v.status === 'verified').length}
                </div>
                <div className="text-gray-600">Verified Vendors</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-amber-600">
                  {vendors.filter(v => v.status === 'pending').length}
                </div>
                <div className="text-gray-600">Pending Review</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-red-600">
                  {vendors.filter(v => v.status === 'rejected').length}
                </div>
                <div className="text-gray-600">Rejected</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Vendor Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registered
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vendors.map((vendor) => (
                      <tr key={vendor.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                            <div className="text-sm text-gray-500">{vendor.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {vendor.phone}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            vendor.status === 'verified'
                              ? 'bg-green-100 text-green-800'
                              : vendor.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {vendor.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(vendor.created_at!).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {vendor.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleVendorStatusUpdate(vendor.id, 'verified')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleVendorStatusUpdate(vendor.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-gray-600">Confirmed Bookings</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-amber-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-gray-600">Pending Bookings</div>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="text-2xl font-bold text-red-600">
                  {bookings.filter(b => b.status === 'cancelled').length}
                </div>
                <div className="text-gray-600">Cancelled Bookings</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Booking Management</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reference
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Dates
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {bookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {booking.booking_reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{booking.customer_name}</div>
                            <div className="text-sm text-gray-500">{booking.customer_email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(booking.check_in_date).toLocaleDateString()} - {new Date(booking.check_out_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{booking.total_amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : booking.status === 'pending'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleBookingStatusUpdate(booking.id, 'confirmed')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleBookingStatusUpdate(booking.id, 'cancelled')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <AccommodationForm
          accommodation={editingAccommodation}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}