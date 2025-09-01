import { X, MapPin, Users, Phone, Utensils, Calendar } from 'lucide-react';
import { Accommodation } from '../types/accommodation';

interface AccommodationModalProps {
  accommodation: Accommodation;
  isOpen: boolean;
  onClose: () => void;
  onBookNow: () => void;
}

export function AccommodationModal({ accommodation, isOpen, onClose, onBookNow }: AccommodationModalProps) {
  if (!isOpen) return null;

  const {
    name,
    type,
    location,
    max_capacity,
    breakfast_included,
    lunch_included,
    dinner_included,
    price_per_night,
    contact_number,
    images,
    description,
  } = accommodation;

  const meals = [
    breakfast_included && 'Breakfast',
    lunch_included && 'Lunch',
    dinner_included && 'Dinner',
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <img
            src={images[0] || 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'}
            alt={name}
            className="w-full h-64 object-cover rounded-t-2xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              type === 'homestay' 
                ? 'bg-emerald-100 text-emerald-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {type === 'homestay' ? 'Homestay' : 'Hotel'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{name}</h2>
              <div className="flex items-center gap-1 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>{location}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-emerald-600">₹{price_per_night}</div>
              <div className="text-sm text-gray-500">per night</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-2 text-gray-700">
              <Users className="h-5 w-5 text-emerald-600" />
              <span>Up to {max_capacity} guests</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <Phone className="h-5 w-5 text-emerald-600" />
              <span>{contact_number}</span>
            </div>
          </div>

          {meals.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Utensils className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-gray-900">Meals Included</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {meals.map((meal) => (
                  <span
                    key={meal}
                    className="bg-amber-50 text-amber-800 px-3 py-1 rounded-full text-sm"
                  >
                    {meal}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-medium text-gray-900 mb-2">About this place</h3>
            <p className="text-gray-600 leading-relaxed">{description}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onBookNow}
              className="flex-1 bg-emerald-600 text-white text-center py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Book Now
            </button>
          </div>
          
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> Contact details and exact location will be provided after booking confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}