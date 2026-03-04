import React, { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface AddVehicleProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (vehicleData: any) => void;
  vehicle?: any; // Vehicle data for editing
  isEditing?: boolean; // Flag to indicate edit mode
}

const AddVehicle: React.FC<AddVehicleProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  vehicle, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: '',
    price: '',
    fuelType: 'PETROL',
    seats: '',
    transmission: 'MANUAL',
    drive: 'FWD',
    category: 'ECONOMY',
    image: null as File | null,
    power: '',
    location: ''
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load vehicle data when editing
  useEffect(() => {
    if (vehicle && isEditing) {
      console.log('Editing vehicle data:', vehicle); // Debug log
      
      // Extract make and model from the name
      // Assuming vehicle.name is like "2022 Toyota Corolla" or "Toyota Corolla"
      const nameStr = vehicle.name || '';
      
      // Try to extract year from name if present (e.g., "2022 Toyota Corolla")
      const yearMatch = nameStr.match(/^(20\d{2})\s+(.+)$/);
      let make = '';
      let model = '';
      let year = vehicle.year || '';
      
      if (yearMatch) {
        // Format: "2022 Toyota Corolla"
        year = yearMatch[1]; // "2022"
        const makeModel = yearMatch[2]; // "Toyota Corolla"
        const makeModelParts = makeModel.split(' ');
        make = makeModelParts[0] || ''; // "Toyota"
        model = makeModelParts.slice(1).join(' ') || ''; // "Corolla"
      } else {
        // Format: "Toyota Corolla" or just the name
        const nameParts = nameStr.split(' ');
        if (nameParts.length > 1) {
          make = nameParts[0] || '';
          model = nameParts.slice(1).join(' ') || '';
        } else {
          // If we can't parse, use the vehicle's make and model fields if they exist
          make = vehicle.make || nameStr;
          model = vehicle.model || '';
        }
      }
      
      setFormData({
        make: make || vehicle.make || '',
        model: model || vehicle.model || '',
        year: year || vehicle.year || '',
        price: vehicle.price?.toString().replace(/[^0-9]/g, '') || '',
        fuelType: (vehicle.fuel || vehicle.fuelType || 'PETROL').toUpperCase(),
        seats: vehicle.seats?.toString() || '',
        transmission: (vehicle.gear || vehicle.transmission || 'MANUAL').toUpperCase(),
        drive: (vehicle.drive || 'FWD').toUpperCase(),
        category: (vehicle.type || vehicle.category || 'ECONOMY').toUpperCase(),
        image: null,
        power: vehicle.power || '',
        location: vehicle.location || ''
      });
      
      // Set image preview if vehicle has an image
      if (vehicle.img || vehicle.image) {
        setImagePreview(vehicle.img || vehicle.image);
      }
    } else {
      // Reset form for new vehicle
      setFormData({
        make: '',
        model: '',
        year: '',
        price: '',
        fuelType: 'PETROL',
        seats: '',
        transmission: 'MANUAL',
        drive: 'FWD',
        category: 'ECONOMY',
        image: null,
        power: '',
        location: ''
      });
      setImagePreview(null);
    }
  }, [vehicle, isEditing, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      setFormData(prev => ({ ...prev, image: file }));
      setError(null);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.make || !formData.model || !formData.year || !formData.price) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const submitData = new FormData();
      submitData.append('make', formData.make);
      submitData.append('model', formData.model);
      submitData.append('year', formData.year);
      submitData.append('price', formData.price);
      submitData.append('fuelType', formData.fuelType);
      submitData.append('seats', formData.seats);
      submitData.append('transmission', formData.transmission);
      submitData.append('drive', formData.drive);
      submitData.append('category', formData.category);
      submitData.append('power', formData.power);
      submitData.append('location', formData.location);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // If editing, include the vehicle ID
      if (isEditing && vehicle?.id) {
        submitData.append('id', vehicle.id);
      }

      const url = isEditing && vehicle?.id
        ? `/features/Admin/Dashboard/api/dashboard/fleet/UpdateVehicle/${vehicle.id}`
        : '/features/Admin/Dashboard/api/dashboard/fleet/AddVehicle';
      
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        body: submitData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} vehicle`);
      }
      
      console.log(`Vehicle ${isEditing ? 'updated' : 'added'}:`, data.vehicle);
      
      if (onSave) onSave(data.vehicle);
      
      // Reset form
      setFormData({
        make: '',
        model: '',
        year: '',
        price: '',
        fuelType: 'PETROL',
        seats: '',
        transmission: 'MANUAL',
        drive: 'FWD',
        category: 'ECONOMY',
        image: null,
        power: '',
        location: ''
      });
      setImagePreview(null);
      
      onClose();
      
    } catch (error: any) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} vehicle:`, error);
      setError(error.message || `Failed to ${isEditing ? 'update' : 'add'} vehicle. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header - changes based on mode */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            {isEditing && vehicle && (
              <p className="text-sm text-gray-500 mt-1">
                Editing: {vehicle.name} ({vehicle.plate})
              </p>
            )}
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* Basic Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="make"
                  value={formData.make}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Toyota"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Corolla"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 2022"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price per day <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="e.g. 5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Vehicle Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fuel Type
                </label>
                <select
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="PETROL">Petrol</option>
                  <option value="DIESEL">Diesel</option>
                  <option value="ELECTRIC">Electric</option>
                  <option value="HYBRID">Hybrid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Seats
                </label>
                <input
                  type="number"
                  name="seats"
                  value={formData.seats}
                  onChange={handleChange}
                  placeholder="e.g. 5"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transmission
                </label>
                <select
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="MANUAL">Manual</option>
                  <option value="AUTOMATIC">Automatic</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Drive Type
                </label>
                <select
                  name="drive"
                  value={formData.drive}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="FWD">FWD</option>
                  <option value="RWD">RWD</option>
                  <option value="AWD">AWD</option>
                  <option value="FOUR_WD">4WD</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="COMPACT">Compact</option>
                  <option value="MIDSIZE">Midsize</option>
                  <option value="STANDARD">Standard</option>
                  <option value="FULLSIZE">Full-size</option>
                  <option value="LUXURY">Luxury</option>
                  <option value="SUV">SUV</option>
                  <option value="SPORTS">Sports</option>
                  <option value="MINIVAN">Minivan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Power (HP)
                </label>
                <input
                  type="text"
                  name="power"
                  value={formData.power}
                  onChange={handleChange}
                  placeholder="e.g. 150 HP"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Nairobi"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle Image
              </label>
              
              {imagePreview ? (
                <div className="relative mb-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-md p-6 mb-2 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors"
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload an image</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF (max. 5MB)</p>
                </div>
              )}
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              {imagePreview && formData.image === null && (
                <p className="text-xs text-gray-500 mt-1">Current image will be kept if no new image uploaded</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white text-sm rounded-md hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : isEditing ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle;