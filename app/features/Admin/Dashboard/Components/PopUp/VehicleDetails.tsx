import React from 'react';
import { X, Car, Fuel, Gauge, Calendar, MapPin, DollarSign, Users, Cog, Star, Tag, Wrench } from 'lucide-react';

interface VehicleDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: any; // This comes from your API which formats the data
}

const VehicleDetails: React.FC<VehicleDetailsProps> = ({ isOpen, onClose, vehicle }) => {
  if (!isOpen || !vehicle) return null;

  // Debug: Log what you're actually receiving
  console.log('Vehicle received in component:', vehicle);

  const getStatusColor = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200';
      case 'rented': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'maintenance': return 'bg-amber-100 text-amber-800 border-amber-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Car className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Vehicle Details</h2>
              <p className="text-xs text-gray-500 mt-0.5">{vehicle.plate}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Vehicle Image */}
          {vehicle.img && (
            <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
              <img 
                src={vehicle.img} 
                alt={vehicle.name}
                className="w-full h-56 object-cover"
              />
            </div>
          )}

          {/* Status Badge */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{vehicle.name}</h3>
              <p className="text-sm text-gray-500 mt-1">
                {vehicle.year} • {vehicle.type}
              </p>
            </div>
            <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(vehicle.status)}`}>
              {vehicle.status?.charAt(0).toUpperCase() + vehicle.status?.slice(1)}
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <DollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Price/Day</p>
              <p className="font-bold text-gray-900">{vehicle.price}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Fuel className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Fuel</p>
              <p className="font-medium text-gray-900">{vehicle.fuel}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Users className="w-5 h-5 text-orange-600 mx-auto mb-1" />
              <p className="text-xs text-gray-500">Seats</p>
              <p className="font-medium text-gray-900">{vehicle.seats}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <Star className="w-5 h-5 text-amber-500 mx-auto mb-1 fill-current" />
              <p className="text-xs text-gray-500">Rating</p>
              <p className="font-medium text-gray-900">{vehicle.rating}/5</p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="border-t border-gray-200 pt-6">
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
            <button className="flex-1 py-2 bg-orange-600 text-white text-sm font-medium rounded-lg hover:bg-orange-700 transition-colors">
              View Booking History
            </button>
            <button className="flex-1 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
              Schedule Maintenance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;