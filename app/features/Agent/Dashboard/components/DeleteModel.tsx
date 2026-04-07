"use client";

import React from 'react';
import { Trash2 } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  vehicle: any;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, loading, vehicle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6 text-center">
          <Trash2 size={48} className="mx-auto text-red-500 mb-4" />
          <p className="text-gray-700 mb-2">Are you sure you want to delete this vehicle?</p>
          <p className="text-sm text-gray-400 mb-6">
            {vehicle?.make} {vehicle?.model} ({vehicle?.plateNumber})
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-2 border rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading} className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50">
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;