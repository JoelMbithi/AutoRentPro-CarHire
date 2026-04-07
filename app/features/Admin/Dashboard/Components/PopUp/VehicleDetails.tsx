import React, { useState } from 'react';
import { X, Car, Fuel, Gauge, Calendar, MapPin, DollarSign, Users, Cog, Star, Tag, Wrench, Maximize2 } from 'lucide-react';

interface VehicleDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any;
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ isOpen, onClose, vehicle }) => {
  const [imageError, setImageError] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!isOpen || !vehicle) return null;

  console.log('Vehicle received:', vehicle);
  console.log('Image path:', vehicle.image || vehicle.img);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'rented': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'maintenance': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Get the image URL from either img or image field
  const imageUrl = vehicle.img || vehicle.image;
  
  // Construct full URL if needed (but it should already be full)
  const fullImageUrl = imageUrl?.startsWith('http') 
    ? imageUrl 
    : imageUrl;

  return (
    <>
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-2">
        <div className="bg-white rounded-md w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Car className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <h2 className="text-lg font-semibold  text-gray-900">Vehicle Details</h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">{vehicle.plate}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-1 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-3">
            {/* Vehicle Image - Clickable Thumbnail */}
            {fullImageUrl && !imageError ? (
              <div 
                className="mb-2 rounded overflow-hidden border border-gray-200 cursor-pointer group relative"
                onClick={() => setIsImageModalOpen(true)}
              >
                <img 
                  src={fullImageUrl} 
                  alt={vehicle.name}
                  className="w-full h-56 object-scale-down group-hover:opacity-90 transition-opacity"
                  onError={(e) => {
                    console.error('Failed to load image:', fullImageUrl);
                    setImageError(true);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                  <div className="bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                    <Maximize2 className="w-3 h-3 text-gray-700" />
                  </div>
                </div>
              </div>
            ) : (
              <div 
                className="mb-6 rounded overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center h-56 cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              >
                <div className="text-center">
                  <Car className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No image available</p>
                  {fullImageUrl && (
                    <p className="text-xs text-gray-400 mt-1">Path: {fullImageUrl}</p>
                  )}
                </div>
              </div>
            )}

            {/* Status Badge */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-xl  font-bold  text-gray-900">{vehicle.name}</h3>
                <p className="text-xs text-gray-500 font-mono">
                  {vehicle.year} • {vehicle.type}
                </p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs  border ${getStatusColor(vehicle.status)}`}>
                {vehicle.status?.charAt(0).toUpperCase() + vehicle.status?.slice(1)}
              </span>
            </div>

            {/* Quick Stats Grid */}
         <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
  {/* Price with KES */}
  <div className="bg-white border border-gray-200 rounded-lg p-2 text-center hover:border-orange-300 hover:shadow-sm transition-all">
    <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-2">
      <span className="text-xs font-bold text-green-600">KES</span>
    </div>
    <p className="text-xs text-gray-500">Per Day</p>
    <p className="text-sm font-semibold text-gray-900 mt-1">{vehicle.price}</p>
  </div>

  {/* Fuel */}
  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:border-orange-300 hover:shadow-sm transition-all">
    <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-2">
      <Fuel className="w-4 h-4 text-orange-500" />
    </div>
    <p className="text-xs text-gray-500">Fuel Type</p>
    <p className="text-xs font-medium text-gray-900 mt-1">{vehicle.fuel}</p>
  </div>

  {/* Seats */}
  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:border-orange-300 hover:shadow-sm transition-all">
    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
      <Users className="w-4 h-4 text-gray-600" />
    </div>
    <p className="text-xs text-gray-500">Seats</p>
    <p className="text-sm font-medium text-gray-900 mt-1">{vehicle.seats}</p>
  </div>

  {/* Rating */}
  <div className="bg-white border border-gray-200 rounded-lg p-3 text-center hover:border-orange-300 hover:shadow-sm transition-all">
    <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
      <Star className="w-4 h-4 text-amber-400 fill-current" />
    </div>
    <p className="text-xs text-gray-500">Rating</p>
    <p className="text-sm font-medium text-gray-900 mt-1">{vehicle.rating}/5</p>
  </div>
</div>

            {/* Details Grid */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-900 mb-4">Specifications</h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Year</p>
                    <p className="text-sm font-medium text-gray-900">{vehicle.year}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Gauge className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Transmission</p>
                    <p className="text-sm font-medium text-gray-900">{vehicle.gear}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Cog className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Drive</p>
                    <p className="text-sm font-medium text-gray-900">{vehicle.drive}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Category</p>
                    <p className="text-sm font-medium text-gray-900">{vehicle.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Power</p>
                    <p className="text-sm font-medium text-gray-900">{vehicle.power || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-900">{vehicle.location || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
              <button className="flex-1 py-2 bg-orange-600 text-white text-sm font-medium rounded hover:bg-orange-700 transition-colors">
                View Booking History
              </button>
              <button className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50 transition-colors">
                Schedule Maintenance
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Image Modal */}
      {isImageModalOpen && fullImageUrl && !imageError && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh]">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img 
              src={fullImageUrl} 
              alt={vehicle.name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleDetails;