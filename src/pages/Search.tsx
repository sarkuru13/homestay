import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { AccommodationCard } from '../components/AccommodationCard';
import { AccommodationModal } from '../components/AccommodationModal';
import { BookingModal } from '../components/BookingModal';
import { BookingSuccess } from '../components/BookingSuccess';
import { useAccommodations } from '../hooks/useAccommodations';
import { Accommodation, SearchFilters } from '../types/accommodation';
import { Loader2 } from 'lucide-react';

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showBookingSuccess, setShowBookingSuccess] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(() => {
    return {
      location: searchParams.get('location') || '',
      type: searchParams.get('type') as any || undefined,
      maxCapacity: searchParams.get('maxCapacity') ? parseInt(searchParams.get('maxCapacity')!) : undefined,
      breakfastIncluded: searchParams.get('breakfastIncluded') === 'true' || undefined,
      lunchIncluded: searchParams.get('lunchIncluded') === 'true' || undefined,
      dinnerIncluded: searchParams.get('dinnerIncluded') === 'true' || undefined,
    };
  });

  const { accommodations, loading, fetchAccommodations } = useAccommodations();

  useEffect(() => {
    fetchAccommodations(filters);
  }, []);

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    fetchAccommodations(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  };

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    fetchAccommodations(newFilters);
    
    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.set(key, value.toString());
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    const clearedFilters = { location: filters.location };
    setFilters(clearedFilters);
    fetchAccommodations(clearedFilters);
    
    const params = new URLSearchParams();
    if (clearedFilters.location) {
      params.set('location', clearedFilters.location);
    }
    setSearchParams(params);
  };

  const handleBookNow = () => {
    setShowBookingModal(true);
  };

  const handleBookingSuccess = (reference: string) => {
    setBookingReference(reference);
    setShowBookingModal(false);
    setSelectedAccommodation(null);
    setShowBookingSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <SearchBar onSearch={handleSearch} loading={loading} />
            <div className="flex items-center justify-between">
              <FilterPanel 
                filters={filters} 
                onFiltersChange={handleFiltersChange}
                onClear={clearFilters}
              />
              <div className="text-sm text-gray-600">
                {loading ? 'Searching...' : `${accommodations.length} accommodations found`}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-2 text-gray-600">Searching accommodations...</span>
          </div>
        ) : accommodations.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <img
                src="https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg"
                alt="No results"
                className="w-32 h-32 object-cover rounded-full mx-auto mb-4 opacity-50"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No accommodations found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse all available options
              </p>
              <button
                onClick={() => handleSearch({ location: '' })}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                View All Accommodations
              </button>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.map((accommodation) => (
              <AccommodationCard
                key={accommodation.id}
                accommodation={accommodation}
                onClick={() => setSelectedAccommodation(accommodation)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {selectedAccommodation && (
        <AccommodationModal
          accommodation={selectedAccommodation}
          isOpen={!!selectedAccommodation}
          onClose={() => setSelectedAccommodation(null)}
          onBookNow={handleBookNow}
          onBookNow={handleBookNow}
        />
      )}

      {/* Booking Modal */}
      {selectedAccommodation && showBookingModal && (
        <BookingModal
          accommodation={selectedAccommodation}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {/* Booking Success Modal */}
      <BookingSuccess
        bookingReference={bookingReference}
        isOpen={showBookingSuccess}
        onClose={() => {
          setShowBookingSuccess(false);
          setBookingReference('');
        }}
      />
    </div>
  );
}