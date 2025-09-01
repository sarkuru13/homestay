import { useState, useEffect } from 'react';
import { useAccommodations } from '../hooks/useAccommodations';
import { useVendors } from '../hooks/useVendors';
import { useBookings } from '../hooks/useBookings';
import { AccommodationForm } from '../components/AccommodationForm';
import { VendorRegistration } from '../components/VendorRegistration';
import { AdminAccommodationCard } from '../components/AdminAccommodationCard';
import { Accommodation, Vendor } from '../types/accommodation';
import { Plus, Store, AlertCircle, CheckCircle, Clock, Search } from 'lucide-react';

export function VendorDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [showRegistration, setShowRegistration] = useState(false);
  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentVendor, setCurrentVendor] = useState<Vendor | null>(null);
  
  const { accommodations, loading, fetchAccommodations, deleteAccommodation } = useAccommodations();
  const { getCurrentVendor } = useVendors();
  const { bookings, fetchBookings } = useBookings();

  useEffect(() => {
    loadVendorData();
  }, []);

  const loadVendorData = async () => {
    try {
      const vendor = await getCurrentVendor();
      setCurrentVendor(vendor);
      
      if (vendor && vendor.status === 'verified') {
        fetchAccommodations();
        fetchBookings();
      }
    } catch (error) {
      console.error('Failed to load vendor data:', error);
    }
  };

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
        fetchAccommodations();
      } catch (error) {
        alert('Failed to delete accommodation');
      }
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingAccommodation(null);
    fetchAccommodations();
  };

  const handleRegistrationSuccess = () => {
    loadVendorData();
  };

  // Show registration form if not a vendor
  if (!currentVendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Store className="w-16 h-16 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vendor Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Register as a vendor to start listing your homestays and hotels in Karbi Anglong.
          </p>
          <button
            onClick={() => setShowRegistration(true)}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium"
          >
            Register as Vendor
          </button>
        </div>

        <VendorRegistration
          isOpen={showRegistration}
          onClose={() => setShowRegistration(false)}
          onSuccess={handleRegistrationSuccess}
        />
      </div>
    );
  }

  // Show pending status
  if (currentVendor.status === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <Clock className="w-16 h-16 text-amber-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Verification Pending</h1>
          <p className="text-gray-600 mb-4">
            Your vendor registration is under review. You'll be able to add accommodations once approved by our admin team.
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="text-amber-800 text-sm">
              <strong>Status:</strong> Pending Review<br />
              <strong>Registered:</strong> {new Date(currentVendor.created_at!).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show rejected status
  if (currentVendor.status === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Rejected</h1>
          <p className="text-gray-600 mb-4">
            Unfortunately, your vendor registration was not approved. Please contact our support team for more information.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">
              <strong>Status:</strong> Rejected<br />
              Contact: admin@karbianglong.com
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show verified vendor dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-green-600 font-medium">Verified Vendor</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {currentVendor.name}</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            Add Accommodation
          </button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search your accommodations..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{accommodations.length}</div>
            <div className="text-gray-600">Total Listings</div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="text-2xl font-bold text-emerald-600">
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
              {bookings.filter(booking => booking.status === 'confirmed').length}
            </div>
            <div className="text-gray-600">Bookings</div>
          </div>
        </div>

        {/* Accommodations List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="ml-2 text-gray-600">Loading accommodations...</span>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAccommodations.map((accommodation) => (
              <div key={accommodation.id} className="relative">
                <AdminAccommodationCard
                  accommodation={accommodation}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                {!accommodation.is_verified && (
                  <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                    Pending Verification
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {filteredAccommodations.length === 0 && !loading && (
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