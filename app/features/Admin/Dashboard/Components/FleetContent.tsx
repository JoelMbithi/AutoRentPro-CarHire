import React, { useState, useEffect } from 'react';
import { Plus, Star, Eye, Car, MapPin, Fuel, Calendar } from 'lucide-react';
import { FleetVehicle } from '@/app/features/car-listing/types';
import AddVehicle from './PopUp/Addvehicle';
import VehicleDetails from './PopUp/VehicleDetails';

interface FleetContentProps {
  fleetVehicles: FleetVehicle[];
  onVehicleUpdate?: (vehicleData: any) => void;
}

const statusConfig = {
  available: { label: 'Available', dot: '#22c55e', bg: '#f0fdf4', text: '#16a34a' },
  rented: { label: 'Rented', dot: '#f97316', bg: '#fff7ed', text: '#ea580c' },
  maintenance: { label: 'In Service', dot: '#eab308', bg: '#fefce8', text: '#ca8a04' },
};

const FleetContent: React.FC<FleetContentProps> = ({ fleetVehicles, onVehicleUpdate }) => {
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<FleetVehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<FleetVehicle | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});
  const [processedVehicles, setProcessedVehicles] = useState<FleetVehicle[]>([]);

  useEffect(() => {
    if (fleetVehicles?.length > 0) {
      const enhanced = fleetVehicles.map(vehicle => {
        if (vehicle.year && vehicle.make && vehicle.model && vehicle.image) return vehicle;
        const parts = vehicle.name.split(' ');
        return {
          ...vehicle,
          year: (vehicle as any).year || parts[0],
          make: (vehicle as any).make || parts[1],
          model: (vehicle as any).model || parts.slice(2).join(' '),
          price: (vehicle as any).price || 'Price N/A',
          type: (vehicle as any).type || 'Unknown',
          fuel: (vehicle as any).fuel || 'N/A',
          location: (vehicle as any).location || null,
          rating: (vehicle as any).rating || 0,
          image: (vehicle as any).image || '',
        };
      });
      setProcessedVehicles(enhanced);
    }
  }, [fleetVehicles]);

  const handleEdit = (v: FleetVehicle) => { setEditingVehicle(v); setIsEditing(true); setShowAddVehicle(true); };
  const handleViewDetails = (v: FleetVehicle) => { setViewingVehicle(v); setShowDetails(true); };
  const handleAddNew = () => { setEditingVehicle(null); setIsEditing(false); setShowAddVehicle(true); };
  const handleClose = () => { setShowAddVehicle(false); setShowDetails(false); setEditingVehicle(null); setViewingVehicle(null); setIsEditing(false); };
  const handleSave = (data: any) => { if (onVehicleUpdate) onVehicleUpdate(data); handleClose(); };
  const handleImageError = (id: number) => setImageErrors(prev => ({ ...prev, [id]: true }));

  const getImageUrl = (path: string) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('/')) return path;
    return `/${path}`;
  };

  const vehicles = processedVehicles.length > 0 ? processedVehicles : fleetVehicles;
  const available = vehicles.filter(v => v.status === 'available').length;
  const rented = vehicles.filter(v => v.status === 'rented').length;
  const maintenance = vehicles.filter(v => v.status === 'maintenance').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');
        .fleet-wrap * { font-family: 'DM Sans', sans-serif; box-sizing: border-box; }
        .fleet-card { background: #fff; border: 1.5px solid #f0f0f0; border-radius: 16px; overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; }
        .fleet-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .car-img { width: 100%; height: 160px; object-fit: cover; display: block; }
        .img-placeholder { width: 100%; height: 160px; background: #f8f8f8; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; color: #bbb; }
        .status-pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 99px; font-size: 11.5px; font-weight: 500; }
        .status-dot { width: 6px; height: 6px; border-radius: 50%; }
        .stat-chip { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 8px; padding: 10px 16px; }
        .price-tag { font-family: 'DM Mono', monospace; font-size: 13px; color: #111; font-weight: 500; }
        .btn-edit { flex: 1; padding: 9px; border: 1.5px solid #e8e8e8; border-radius: 10px; background: #fff; font-size: 13px; font-weight: 500; color: #555; cursor: pointer; transition: all 0.15s; }
        .btn-edit:hover { border-color: #ccc; background: #fafafa; }
        .btn-details { flex: 1; padding: 9px; border: none; border-radius: 10px; background: #fff4ee; font-size: 13px; font-weight: 500; color: #ea580c; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .btn-details:hover { background: #ffede0; }
        .btn-add { padding: 9px 18px; background: #111; color: #fff; border: none; border-radius: 10px; font-size: 13.5px; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 7px; transition: background 0.15s; font-family: 'DM Sans', sans-serif; }
        .btn-add:hover { background: #333; }
        .meta-row { display: flex; align-items: center; gap: 5px; font-size: 12.5px; color: #888; }
        .meta-row svg { flex-shrink: 0; }
      `}</style>

      <div className="fleet-wrap">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 22, fontWeight: 600, color: '#111', margin: 0 }}>Fleet</h1>
          <p style={{ fontSize: 14, color: '#999', marginTop: 4 }}>Your vehicles, at a glance</p>
        </div>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Total', value: vehicles.length, color: '#111' },
            { label: 'Available', value: available, color: '#16a34a' },
            { label: 'Rented', value: rented, color: '#ea580c' },
            ...(maintenance > 0 ? [{ label: 'In Service', value: maintenance, color: '#ca8a04' }] : []),
          ].map(s => (
            <div key={s.label} className="stat-chip">
              <div style={{ fontSize: 20, fontWeight: 600, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#aaa', marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <button className="btn-add" onClick={handleAddNew}>
            <Plus size={15} />
            Add vehicle
          </button>
        </div>

        {/* Modals */}
        <AddVehicle isOpen={showAddVehicle} onClose={handleClose} onSave={handleSave} vehicle={editingVehicle} isEditing={isEditing} />
        <VehicleDetails isOpen={showDetails} onClose={handleClose} vehicle={viewingVehicle} />

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {vehicles.map((car, i) => {
            const key = car.id ? `car-${car.id}-${car.plate}` : `car-${i}-${car.plate}`;
            const status = statusConfig[car.status as keyof typeof statusConfig] || statusConfig.available;
            const hasImage = !imageErrors[car.id] && car.image;

            return (
              <div key={key} className="fleet-card">
                {/* Image */}
                <div style={{ position: 'relative' }}>
                  {hasImage ? (
                    <img
                      src={getImageUrl(car.image)}
                      alt={car.name}
                      className="car-img"
                      onError={() => handleImageError(car.id)}
                    />
                  ) : (
                    <div className="img-placeholder">
                      <Car size={28} color="#ddd" />
                      <span style={{ fontSize: 12 }}>No photo</span>
                    </div>
                  )}
                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span className="status-pill" style={{ background: status.bg, color: status.text }}>
                      <span className="status-dot" style={{ background: status.dot }} />
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '14px 16px 16px' }}>
                  {/* Title */}
                  <div style={{ marginBottom: 10 }}>
                    <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: '#111' }}>{car.name}</h3>
                    <span style={{ fontSize: 12, color: '#bbb', fontFamily: "'DM Mono', monospace" }}>{car.plate}</span>
                  </div>

                  {/* Meta info */}
                  <div style={{ display: 'flex', gap: 12, marginBottom: 12, flexWrap: 'wrap' }}>
                    {car.location && (
                      <div className="meta-row">
                        <MapPin size={12} />
                        {car.location}
                      </div>
                    )}
                    {car.fuel && (
                      <div className="meta-row">
                        <Fuel size={12} />
                        {(car.fuel as string).split(' ')[0]}
                      </div>
                    )}
                    {car.year && (
                      <div className="meta-row">
                        <Calendar size={12} />
                        {car.year}
                      </div>
                    )}
                  </div>

                  {/* Price + Rating */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                    <span className="price-tag">{car.price}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Star size={13} fill="#facc15" color="#facc15" />
                      <span style={{ fontSize: 13, color: '#555', fontWeight: 500 }}>{car.rating}</span>
                    </div>
                  </div>

                  {/* Type chip */}
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: '#888', background: '#f5f5f5', padding: '3px 8px', borderRadius: 6 }}>
                      {(car.type as string).toUpperCase()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-edit" onClick={() => handleEdit(car)}>Edit</button>
                    <button className="btn-details" onClick={() => handleViewDetails(car)}>
                      <Eye size={13} /> Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FleetContent;