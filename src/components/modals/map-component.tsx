'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapComponentProps {
  onLocationSelect: (coordinates: { lat: number; lng: number }) => void;
  initialCoordinates?: { lat: number; lng: number };
  selectedCoordinates?: { lat: number; lng: number } | null;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (coordinates: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng });
    },
  });
  return null;
}

const MapComponent = ({
  onLocationSelect,
  initialCoordinates,
  selectedCoordinates,
}: MapComponentProps) => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  const defaultCoords = initialCoordinates || { lat: 10.3865296, lng: 78.0052919 };
  const center: [number, number] = [defaultCoords.lat, defaultCoords.lng];

  useEffect(() => {
    if (selectedCoordinates) {
      setPosition([selectedCoordinates.lat, selectedCoordinates.lng]);
    } else if (initialCoordinates) {
      setPosition([initialCoordinates.lat, initialCoordinates.lng]);
    }
  }, [selectedCoordinates, initialCoordinates]);

  const handleLocationSelect = (coordinates: { lat: number; lng: number }) => {
    setPosition([coordinates.lat, coordinates.lng]);
    onLocationSelect(coordinates);
  };

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%', minHeight: '384px' }}
      className="rounded-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapClickHandler onLocationSelect={handleLocationSelect} />
      
      {position && (
        <Marker position={position} />
      )}
    </MapContainer>
  );
};

export default MapComponent; 