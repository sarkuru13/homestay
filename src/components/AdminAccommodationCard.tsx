import { Edit, Trash2, MapPin, Users, Phone, Utensils } from 'lucide-react';
import { Accommodation } from '../types/accommodation';

interface AdminAccommodationCardProps {
  accommodation: Accommodation;
  onEdit: (accommodation: Accommodation) => void;
  onDelete: (id: string) => void;
}

export function AdminAccommodationCard({ accommodation, onEdit, onDelete }: AdminAccommodationCardProps) {
  const {
    id,
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
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <img
          src={images[0] || 'https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg'}
          alt={name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3 flex gap-2">
          <button
            onClick={() => onEdit(accommodation)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors shadow-lg"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => onDelete(id)}
            className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            type === 'homestay' 
              ? 'bg-emerald-100 text-emerald-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {type === 'homestay' ? 'Homestay' : 'Hotel'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">{name}</h3>
          <div className="text-right">
            <div className="text-2xl font-bold text-emerald-600">₹{price_per_night}</div>
            <div className="text-sm text-gray-500">per night</div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-600 mb-2">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>

        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>Up to {max_capacity} guests</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="h-4 w-4" />
            <span>{contact_number}</span>
          </div>
        </div>

        {meals.length > 0 && (
          <div className="flex items-center gap-1 mb-3">
            <Utensils className="h-4 w-4 text-amber-600" />
            <span className="text-sm text-gray-600">
              {meals.join(', ')} included
            </span>
          </div>
        )}

        <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
      </div>
    </div>
  );
}