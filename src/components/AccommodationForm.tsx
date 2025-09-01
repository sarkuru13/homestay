import { useState, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { useAccommodations } from '../hooks/useAccommodations';
import { Accommodation, AccommodationType } from '../types/accommodation';

interface AccommodationFormProps {
  accommodation?: Accommodation | null;
  onClose: () => void;
}

export function AccommodationForm({ accommodation, onClose }: AccommodationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'homestay' as AccommodationType,
    location: '',
    latitude: 0,
    longitude: 0,
    max_capacity: 1,
    breakfast_included: false,
    lunch_included: false,
    dinner_included: false,
    price_per_night: 0,
    contact_number: '',
    images: [] as string[],
    description: '',
    exact_address: '',
  });
  
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { addAccommodation, updateAccommodation, uploadImage } = useAccommodations();

  useEffect(() => {
    if (accommodation) {
      setFormData({
        name: accommodation.name,
        type: accommodation.type,
        location: accommodation.location,
        latitude: accommodation.latitude || 0,
        longitude: accommodation.longitude || 0,
        max_capacity: accommodation.max_capacity,
        breakfast_included: accommodation.breakfast_included,
        lunch_included: accommodation.lunch_included,
        dinner_included: accommodation.dinner_included,
        price_per_night: accommodation.price_per_night,
        contact_number: accommodation.contact_number,
        images: accommodation.images,
        description: accommodation.description,
        exact_address: accommodation.exact_address,
      });
    }
  }, [accommodation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (accommodation) {
        await updateAccommodation(accommodation.id, formData);
      } else {
        await addAccommodation(formData);
      }
      onClose();
    } catch (error) {
      alert('Failed to save accommodation');
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    } catch (error) {
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            {accommodation ? 'Edit Accommodation' : 'Add New Accommodation'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Enter accommodation name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => updateField('type', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="homestay">Homestay</option>
                <option value="hotel">Hotel</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => updateField('location', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="e.g., Diphu, Karbi Anglong"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exact Address *
            </label>
            <textarea
              value={formData.exact_address}
              onChange={(e) => updateField('exact_address', e.target.value)}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Full address with landmarks (will be shared only after booking confirmation)"
            />
            <p className="text-xs text-gray-500 mt-1">
              This address will only be shared with customers after booking confirmation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Maximum Capacity *
              </label>
              <input
                type="number"
                min="1"
                value={formData.max_capacity}
                onChange={(e) => updateField('max_capacity', parseInt(e.target.value))}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price per Night (₹) *
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price_per_night}
                onChange={(e) => updateField('price_per_night', parseFloat(e.target.value))}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number *
            </label>
            <input
              type="tel"
              value={formData.contact_number}
              onChange={(e) => updateField('contact_number', e.target.value)}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="+91-9876543210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meals Included
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.breakfast_included}
                  onChange={(e) => updateField('breakfast_included', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">Breakfast</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.lunch_included}
                  onChange={(e) => updateField('lunch_included', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">Lunch</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.dinner_included}
                  onChange={(e) => updateField('dinner_included', e.target.checked)}
                  className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="ml-2 text-sm text-gray-700">Dinner</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg cursor-pointer transition-colors">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm font-medium">
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />
                </label>
              </div>
              
              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Describe the accommodation..."
            />
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
              disabled={saving}
              className="flex-1 bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition-colors font-medium disabled:opacity-50"
            >
              {saving ? 'Saving...' : accommodation ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}