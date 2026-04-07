import React, { useState, useEffect } from 'react';
import { Plus, Star, Eye, Car, MapPin, Fuel, Calendar,Users } from 'lucide-react';
import { FleetVehicle } from '@/app/features/car-listing/types';
import AddVehicle from '../Components/PopUp/Addvehicle';
import VehicleDetails from '../Components/PopUp/VehicleDetails';

interface FleetContentProps {
  fleetVehicles: FleetVehicle[];
  onVehicleUpdate?: (vehicleData: any) => void;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  available:   { label: 'Available',  dot: 'bg-emerald-400', pill: 'bg-emerald-50 text-emerald-600' },
  rented:      { label: 'Rented',     dot: 'bg-orange-400',  pill: 'bg-orange-50 text-orange-700'   },
  maintenance: { label: 'In Service', dot: 'bg-yellow-400',  pill: 'bg-yellow-50 text-yellow-700'   },
};

const StatusPill = ({ status }: { status: string }) => {
  const cfg = STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.available;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${cfg.pill}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────
const FleetContent: React.FC<FleetContentProps> = ({ fleetVehicles, onVehicleUpdate }) => {
  const [showAddVehicle, setShowAddVehicle]       = useState(false);
  const [showDetails, setShowDetails]             = useState(false);
  const [editingVehicle, setEditingVehicle]       = useState<FleetVehicle | null>(null);
  const [viewingVehicle, setViewingVehicle]       = useState<FleetVehicle | null>(null);
  const [isEditing, setIsEditing]                 = useState(false);
  const [imageErrors, setImageErrors]             = useState<Record<number, boolean>>({});
  const [processedVehicles, setProcessedVehicles] = useState<FleetVehicle[]>([]);

  useEffect(() => {
    if (fleetVehicles?.length > 0) {
      const enhanced = fleetVehicles.map(vehicle => {
        if (vehicle.year && vehicle.make && vehicle.model && vehicle.image && vehicle.seats && vehicle.location) return vehicle;
        const parts = vehicle.name.split(' ');
        return {
          ...vehicle,
          year:     (vehicle as any).year     || parts[0],
          make:     (vehicle as any).make     || parts[1],
          model:    (vehicle as any).model    || parts.slice(2).join(' '),
          seats:    (vehicle as any).seats     ?? 5,
          price:    (vehicle as any).price    || 'Price N/A',
          type:     (vehicle as any).type     || 'Unknown',
          fuel:     (vehicle as any).fuel     || 'N/A',
          location: (vehicle as any).location || null,
          rating:   (vehicle as any).rating   || 0,
          image:    (vehicle as any).image    || '',
        };
      });
      setProcessedVehicles(enhanced);
    }
  }, [fleetVehicles]);

  const handleEdit        = (v: FleetVehicle) => { setEditingVehicle(v); setIsEditing(true); setShowAddVehicle(true); };
  const handleViewDetails = (v: FleetVehicle) => { setViewingVehicle(v); setShowDetails(true); };
  const handleAddNew      = () => { setEditingVehicle(null); setIsEditing(false); setShowAddVehicle(true); };
  const handleClose       = () => { setShowAddVehicle(false); setShowDetails(false); setEditingVehicle(null); setViewingVehicle(null); setIsEditing(false); };
  const handleSave        = (data: any) => { if (onVehicleUpdate) onVehicleUpdate(data); handleClose(); };
  const handleImageError  = (id: number) => setImageErrors(prev => ({ ...prev, [id]: true }));

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return `/${path}`;
  };

  const vehicles    = processedVehicles.length > 0 ? processedVehicles : fleetVehicles;
  const available   = vehicles.filter(v => v.status === 'available').length;
  const rented      = vehicles.filter(v => v.status === 'rented').length;
  const maintenance = vehicles.filter(v => v.status === 'maintenance').length;

  const summaryStats = [
    { label: 'Total',      value: vehicles.length, valueClass: 'text-gray-900'    },
    { label: 'Available',  value: available,        valueClass: 'text-emerald-600' },
    { label: 'Rented',     value: rented,           valueClass: 'text-orange-700'  },
    ...(maintenance > 0
      ? [{ label: 'In Service', value: maintenance, valueClass: 'text-yellow-700' }]
      : []
    ),
  ];

  return (
    <>
      <AddVehicle
        isOpen={showAddVehicle}
        onClose={handleClose}
        onSave={handleSave}
        vehicle={editingVehicle}
        isEditing={isEditing}
      />
      <VehicleDetails
        isOpen={showDetails}
        onClose={handleClose}
        vehicle={viewingVehicle}
      />

      <div className="flex flex-col gap-5 p-1">

        {/* ── Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-lg font-medium text-gray-900 tracking-tight">Fleet</h1>
            <p className="text-xs text-gray-400 mt-0.5">Your vehicles, at a glance</p>
          </div>
          <button
            onClick={handleAddNew}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-2 bg-gray-900 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors"
          >
            <Plus size={13} />
            Add vehicle
          </button>
        </div>

        {/* ── Summary chips ── */}
        <div className="flex flex-wrap items-center gap-2">
          {summaryStats.map(s => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 min-w-[72px]"
            >
              <div className={`text-xl font-semibold leading-none ${s.valueClass}`}>{s.value}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── Grid ── */}
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-300">
            <Car size={36} />
            <p className="mt-3 text-sm">No vehicles yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vehicles.map((car, i) => {
              const key      = car.id ? `car-${car.id}-${car.plate}` : `car-${i}-${car.plate}`;
              const hasImage = !imageErrors[car.id] && car.image;

              return (
                <div
                  key={key}
                  className="bg-white border border-gray-200 rounded overflow-hidden hover:shadow hover:-translate-y-0.5 transition-all duration-200"
                >
                  {/* ── Image ── */}
                  <div className="relative">
                    {hasImage ? (
                      <img
                        src={getImageUrl(car.image)}
                        alt={car.name}
                        className="w-full h-40 object-cover block"
                        onError={() => handleImageError(car.id)}
                      />
                    ) : (
                      <div className="w-full h-40 bg-gray-50 flex flex-col items-center justify-center gap-2">
                        <Car size={26} className="text-gray-200" />
                        <span className="text-[11px] text-gray-300">No photo</span>
                      </div>
                    )}
                    <div className="absolute top-2.5 right-2.5">
                      <StatusPill status={car.status} />
                    </div>
                  </div>

                  {/* ── Body ── */}
                  <div className="p-4 flex flex-col gap-3">

                    {/* Name + plate */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 leading-tight">{car.name}</h3>
                      <span className="block text-[10px] font-mono text-gray-400 mt-0.5">{car.plate}</span>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      {car.location && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <MapPin size={10} className="shrink-0" />
                          {car.location}
                        </span>
                      )}
                      {car.fuel && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Fuel size={10} className="shrink-0" />
                          {(car.fuel as string).split(' ')[0]}
                        </span>
                      )}
                      {car.seats && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Users size={10} className="shrink-0" />
                          {car.seats} seats
                        </span>
                      )}
                      {car.year && (
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <Calendar size={10} className="shrink-0" />
                          {car.year}
                        </span>
                      )}
                    </div>

                    {/* Price + rating */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium font-mono text-gray-900">{car.price}</span>
                      <div className="flex items-center gap-1">
                        <Star size={12} fill="#facc15" color="#facc15" />
                        <span className="text-xs font-medium text-gray-500">{car.rating}</span>
                      </div>
                    </div>

                    {/* Type chip */}
                    {car.type && (
                      <div>
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">
                          {car.type as string}
                        </span>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-1 border-t border-gray-100">
                      <button
                        onClick={() => handleEdit(car)}
                        className="flex-1 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleViewDetails(car)}
                        className="flex-1 py-2 rounded-lg text-xs font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Eye size={12} /> Details
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </>
  );
};

export default FleetContent;