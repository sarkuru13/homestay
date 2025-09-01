import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { SearchFilters } from '../types/accommodation';
import { MapPin, Home as HomeIcon, Users, Star } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (filters: SearchFilters) => {
    setIsSearching(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          searchParams.set(key, value.toString());
        }
      });
      
      navigate(`/search?${searchParams.toString()}`);
      setIsSearching(false);
    }, 500);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg)',
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Discover Karbi Anglong
          </h1>
          <p className="text-xl text-white mb-8 opacity-90">
            Find the perfect homestays and hotels in the heart of Assam's most beautiful district
          </p>
          
          <SearchBar onSearch={handleSearch} loading={isSearching} />
        </div>
      </div>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Karbi Anglong?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the rich culture, stunning landscapes, and warm hospitality of Karbi Anglong
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Rich Culture</h3>
              <p className="text-gray-600">Immerse yourself in authentic Karbi traditions and customs</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <HomeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Authentic Stays</h3>
              <p className="text-gray-600">Choose from traditional homestays to modern hotels</p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Warm Hospitality</h3>
              <p className="text-gray-600">Experience the renowned warmth of Karbi people</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Destinations
            </h2>
            <p className="text-lg text-gray-600">
              Explore the most sought-after locations in Karbi Anglong
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Diphu', image: 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg' },
              { name: 'Hamren', image: 'https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg' },
              { name: 'Bokajan', image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg' },
              { name: 'Howraghat', image: 'https://images.pexels.com/photos/1475938/pexels-photo-1475938.jpeg' },
            ].map((destination) => (
              <div
                key={destination.name}
                onClick={() => handleSearch({ location: destination.name })}
                className="relative h-48 rounded-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-300 shadow-md hover:shadow-lg"
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <h3 className="text-white text-xl font-semibold">{destination.name}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-emerald-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Explore Karbi Anglong?
          </h2>
          <p className="text-xl text-emerald-100 mb-8">
            Book your perfect accommodation today and create unforgettable memories
          </p>
          <button
            onClick={() => handleSearch({ location: '' })}
            className="bg-white text-emerald-600 px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-50 transition-colors transform hover:scale-105 duration-200"
          >
            View All Accommodations
          </button>
        </div>
      </section>
    </div>
  );
}