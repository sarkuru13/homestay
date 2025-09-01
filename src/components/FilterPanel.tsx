import { useState } from 'react';
import { Filter, X } from 'lucide-react';
import { SearchFilters, AccommodationType } from '../types/accommodation';

interface FilterPanelProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
  onClear: () => void;
}

export function FilterPanel({ filters, onFiltersChange, onClear }: FilterPanelProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const hasActiveFilters = Object.keys(filters).some(key => 
    key !== 'location' && filters[key as keyof SearchFilters]
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          hasActiveFilters 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
        }`}
      >
        <Filter className="h-4 w-4" />
        Filters
        {hasActiveFilters && (
          <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded-full">
            Active
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Filters</h3>
            <div className="flex items-center gap-2">
              {hasActiveFilters && (
                <button
                  onClick={onClear}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Clear all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={filters.type || ''}
                onChange={(e) => updateFilter('type', e.target.value as AccommodationType || undefined)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="">All types</option>
                <option value="homestay">Homestay</option>
                <option value="hotel">Hotel</option>
              </select>
            </div>

            {/* Capacity Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Capacity
              </label>
              <input
                type="number"
                min="1"
                value={filters.maxCapacity || ''}
                onChange={(e) => updateFilter('maxCapacity', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Any"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Meal Filters */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meals Included
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.breakfastIncluded || false}
                    onChange={(e) => updateFilter('breakfastIncluded', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Breakfast</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.lunchIncluded || false}
                    onChange={(e) => updateFilter('lunchIncluded', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Lunch</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.dinnerIncluded || false}
                    onChange={(e) => updateFilter('dinnerIncluded', e.target.checked || undefined)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Dinner</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}