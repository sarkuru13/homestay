import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { SearchFilters } from '../types/accommodation';

interface SearchBarProps {
  onSearch: (filters: SearchFilters) => void;
  loading?: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ location: location.trim() });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Search by location in Karbi Anglong..."
          className="block w-full pl-10 pr-12 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <Search className={`h-6 w-6 ${loading ? 'text-gray-400' : 'text-emerald-600 hover:text-emerald-700'} transition-colors`} />
        </button>
      </div>
    </form>
  );
}