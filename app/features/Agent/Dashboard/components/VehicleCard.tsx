"use client";

import React from 'react';
import { Car, Calendar, Users, Fuel, MapPin, Star, Edit2, Eye, Trash2 } from 'lucide-react';
import StatusPill from './StatusPill';


interface VehicleCardProps {
  vehicle: any;
  onEdit: (vehicle: any) => void;
  onDelete: () => void;
}

const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, onEdit, onDelete }) => {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative h-48 bg-gray-100">
          {vehicle.image ? (
            <img src={vehicle.image} alt={vehicle.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Car size={48} className="text-gray-300" />
            </div>
          )}
          <div className="absolute top-3 right-3">
            <StatusPill status={vehicle.status} />
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-base font-semibold text-gray-900">{vehicle.make} {vehicle.model}</h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{vehicle.plateNumber}</p>

          <div className="flex flex-wrap gap-3 mt-3 text-xs text-gray-500">
            {vehicle.year && <span className="flex items-center gap-1"><Calendar size={12} /> {vehicle.year}</span>}
            {vehicle.seats && <span className="flex items-center gap-1"><Users size={12} /> {vehicle.seats} seats</span>}
            {vehicle.fuelType && <span className="flex items-center gap-1"><Fuel size={12} /> {vehicle.fuelType}</span>}
            {vehicle.location && <span className="flex items-center gap-1"><MapPin size={12} /> {vehicle.location}</span>}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <span className="text-lg font-bold text-gray-900">{vehicle.price}</span>
            <div className="flex items-center gap-1">
              <Star size={14} fill="#facc15" color="#facc15" />
              <span className="text-sm font-medium">{vehicle.rating || 0}</span>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={() => onEdit(vehicle)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Edit2 size={12} /> Edit
            </button>
            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <Eye size={12} /> Details
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">Vehicle Details</h3>
              <button onClick={() => setShowDetails(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                ✕
              </button>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-4 mb-4">
                {vehicle.image ? (
                  <img src={vehicle.image} alt={vehicle.name} className="w-24 h-24 object-cover rounded-lg" />
                ) : (
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Car size={32} className="text-gray-300" />
                  </div>
                )}
                <div>
                  <h4 className="text-lg font-bold">{vehicle.make} {vehicle.model}</h4>
                  <p className="text-sm text-gray-500">{vehicle.plateNumber}</p>
                  <StatusPill status={vehicle.status} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500">Year:</span> {vehicle.year}</div>
                <div><span className="text-gray-500">Price:</span> {vehicle.price}</div>
                <div><span className="text-gray-500">Fuel:</span> {vehicle.fuelType}</div>
                <div><span className="text-gray-500">Seats:</span> {vehicle.seats}</div>
                <div><span className="text-gray-500">Location:</span> {vehicle.location}</div>
                <div><span className="text-gray-500">Rating:</span> ⭐ {vehicle.rating || 0}</div>
                <div><span className="text-gray-500">Transmission:</span> {vehicle.transmission}</div>
                <div><span className="text-gray-500">Color:</span> {vehicle.color || 'N/A'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VehicleCard;