"use client";

import React, { useState } from 'react';
import { Plus, Car } from 'lucide-react';

import DeleteModal from './DeleteModel';
import VehicleCard from './VehicleCard';

interface FleetSectionProps {
  vehicles: any[];
  onAddClick: () => void;
  onEdit: (vehicle: any) => void;
  onRefresh: () => void;
}

const FleetSection: React.FC<FleetSectionProps> = ({ vehicles, onAddClick, onEdit, onRefresh }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/features/Agent/api/agent/vehicles/${selectedVehicle?.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setShowDeleteModal(false);
        onRefresh();
        setSelectedVehicle(null);
      } else {
        alert(data.error || "Failed to delete vehicle");
      }
    } catch (error) {
      console.error("Error deleting vehicle:", error);
      alert("Failed to delete vehicle");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-sm text-gray-500">Manage your car fleet</p>
        </div>
        <button
          onClick={onAddClick}
          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <Plus size={16} />
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
          <Car size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-400">No vehicles yet. Click "Add Vehicle" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onEdit={onEdit}
              onDelete={() => {
                setSelectedVehicle(vehicle);
                setShowDeleteModal(true);
              }}
            />
          ))}
        </div>
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        loading={deleting}
        vehicle={selectedVehicle}
      />
    </div>
  );
};

export default FleetSection;