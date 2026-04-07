"use client";

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

interface AddVehicleProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (vehicleData: any) => void;
  vehicle?: any;
  isEditing?: boolean;
}

const INITIAL_FORM = {
  make: '', model: '', year: '', price: '',
  fuelType: 'PETROL', seats: '', transmission: 'MANUAL',
  drive: 'FWD', category: 'ECONOMY', image: null as File | null,
  power: '', location: '', plateNumber: '', color: '',
};

const inputCls = 'w-full px-3 py-2 border border-gray-200 rounded text-sm text-gray-900 placeholder:text-gray-300 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 transition-colors';
const labelCls = 'block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide';

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className={labelCls}>
      {label}{required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const AddVehicle: React.FC<AddVehicleProps> = ({ isOpen, onClose, onSave, vehicle, isEditing = false }) => {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (vehicle && isEditing) {
      setFormData({
        make: vehicle.make || '',
        model: vehicle.model || '',
        year: vehicle.year || '',
        price: vehicle.price?.toString().replace(/[^0-9]/g, '') || '',
        fuelType: (vehicle.fuelType || 'PETROL').toUpperCase(),
        seats: vehicle.seats?.toString() || '',
        transmission: (vehicle.transmission || 'MANUAL').toUpperCase(),
        drive: (vehicle.drive || 'FWD').toUpperCase(),
        category: (vehicle.category || 'ECONOMY').toUpperCase(),
        image: null,
        power: vehicle.power || '',
        location: vehicle.location || '',
        plateNumber: vehicle.plateNumber || '',
        color: vehicle.color || '',
      });
      if (vehicle.image) setImagePreview(vehicle.image);
    } else {
      setFormData(INITIAL_FORM);
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
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setError('File size must be less than 5MB'); return; }
    if (!file.type.startsWith('image/')) { setError('Please upload an image file'); return; }
    setFormData(prev => ({ ...prev, image: file }));
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.make || !formData.model || !formData.year || !formData.price || !formData.plateNumber) {
      setError('Please fill in all required fields (Make, Model, Year, Price, Plate Number)');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const submitData = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== '') submitData.append(k, v as string);
      });
      if (formData.image) submitData.append('image', formData.image);

      const url = isEditing && vehicle?.id
        ? `/features/Agent/api/agent/vehicles/${vehicle.id}`
        : '/features/Agent/api/agent/vehicles';
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        body: submitData,
        credentials: 'include',
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'add'} vehicle`);

      if (onSave) onSave(data.vehicle);
      setFormData(INITIAL_FORM);
      setImagePreview(null);
      onClose();
    } catch (err: any) {
      setError(err.message || `Failed to ${isEditing ? 'update' : 'add'} vehicle. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex items-start justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {isEditing ? 'Edit Vehicle' : 'Add New Vehicle'}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {isEditing ? 'Update your vehicle information' : 'List your car for rent'}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {error && (
          <div className="mx-6 mt-4 px-3 py-2.5 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Make" required>
              <input type="text" name="make" value={formData.make} onChange={handleChange}
                placeholder="e.g., Toyota" className={inputCls} />
            </Field>
            <Field label="Model" required>
              <input type="text" name="model" value={formData.model} onChange={handleChange}
                placeholder="e.g., Camry" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Year" required>
              <input type="text" name="year" value={formData.year} onChange={handleChange}
                placeholder="2022" className={inputCls} />
            </Field>
            <Field label="Price (KSH)" required>
              <input type="text" name="price" value={formData.price} onChange={handleChange}
                placeholder="5000" className={inputCls} />
            </Field>
            <Field label="Plate Number" required>
              <input type="text" name="plateNumber" value={formData.plateNumber} onChange={handleChange}
                placeholder="KBA 123A" className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Fuel type">
              <select name="fuelType" value={formData.fuelType} onChange={handleChange} className={inputCls}>
                <option value="PETROL">Petrol</option>
                <option value="DIESEL">Diesel</option>
                <option value="ELECTRIC">Electric</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </Field>
            <Field label="Seats">
              <input type="number" name="seats" value={formData.seats} onChange={handleChange}
                placeholder="5" className={inputCls} />
            </Field>
            <Field label="Transmission">
              <select name="transmission" value={formData.transmission} onChange={handleChange} className={inputCls}>
                <option value="MANUAL">Manual</option>
                <option value="AUTOMATIC">Automatic</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Color">
              <input type="text" name="color" value={formData.color} onChange={handleChange}
                placeholder="e.g., Red, Blue, Black" className={inputCls} />
            </Field>
            <Field label="Location">
              <input type="text" name="location" value={formData.location} onChange={handleChange}
                placeholder="Nairobi, Mombasa..." className={inputCls} />
            </Field>
          </div>

          <Field label="Vehicle Image">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="Preview"
                  className="w-full h-44 object-cover rounded-lg border border-gray-200" />
                <button type="button" onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-white border border-gray-200 rounded-full hover:bg-gray-50 transition-colors">
                  <X size={13} className="text-gray-500" />
                </button>
              </div>
            ) : (
              <button type="button" onClick={() => fileInputRef.current?.click()}
                className="w-full border border-dashed border-gray-200 rounded-lg py-8 flex flex-col items-center gap-2 hover:border-orange-400 hover:bg-orange-50 transition-colors">
                <Upload size={18} className="text-gray-300" />
                <span className="text-xs text-gray-400">Click to upload image</span>
                <span className="text-[11px] text-gray-300">JPG, PNG · max 5 MB</span>
              </button>
            )}
            <input ref={fileInputRef} type="file" accept="image/*"
              onChange={handleFileChange} className="hidden" />
          </Field>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="px-4 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {loading ? 'Saving...' : isEditing ? 'Update Vehicle' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicle; 