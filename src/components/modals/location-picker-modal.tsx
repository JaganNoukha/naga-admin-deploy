'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/modals/map-component'), {
  ssr: false,
  loading: () => (
    <div className="h-96 w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
});

interface LocationPickerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLocationSelect: (coordinates: { lat: number; lng: number }) => void;
  initialCoordinates?: { lat: number; lng: number };
}

export function LocationPickerModal({
  open,
  onOpenChange,
  onLocationSelect,
  initialCoordinates,
}: LocationPickerModalProps) {
  const [selectedCoordinates, setSelectedCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(initialCoordinates || null);

  useEffect(() => {
    if (initialCoordinates) {
      setSelectedCoordinates(initialCoordinates);
    }
  }, [initialCoordinates]);

  const handleLocationSelect = (coordinates: { lat: number; lng: number }) => {
    setSelectedCoordinates(coordinates);
  };

  const handleConfirm = () => {
    if (selectedCoordinates) {
      onLocationSelect(selectedCoordinates);
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setSelectedCoordinates(initialCoordinates || null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col gap-1">
              <div className="bg-freshleaf/10 w-fit rounded-full p-2">
                <MapPin className="text-freshleaf h-5 w-5" />
              </div>
              <div className="text-lg font-medium">Pin Location</div>
              <div className="text-sm font-normal text-zinc-500">
                Click on the map to select the warehouse location
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 w-full">
          <div className="h-96 w-full rounded-lg overflow-hidden border">
            <MapComponent
              onLocationSelect={handleLocationSelect}
              initialCoordinates={initialCoordinates}
              selectedCoordinates={selectedCoordinates}
            />
          </div>

          {selectedCoordinates && (
            <div className="bg-neutral-100 p-3 rounded-lg">
              <div className="text-sm font-medium text-gray-700 mb-1">
                Selected Coordinates:
              </div>
              <div className="text-sm text-gray-600">
                Latitude: {selectedCoordinates.lat.toFixed(6)}, Longitude:{' '}
                {selectedCoordinates.lng.toFixed(6)}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedCoordinates}
              className="flex items-center gap-2"
            >
              Confirm Location
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 