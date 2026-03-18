'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { MAP_CENTER, MAP_ZOOM } from '@/utils/constants';
import WaterSourceMarker from './WaterSourceMarker';
import MapLegend from './MapLegend';

// Fixes Leaflet icon issue in Next.js
const fixLeafletIcons = () => {
  if (typeof window === 'undefined') return;
  const L = require('leaflet');
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

export default function MapView({ sources = [], onSourceClick }) {
  useEffect(() => {
    fixLeafletIcons();
  }, []);

  return (
    <div className="map-container rounded-xl overflow-hidden shadow border border-gray-200">
      <MapContainer
        center={[MAP_CENTER.lat, MAP_CENTER.lng]}
        zoom={MAP_ZOOM}
        style={{ height: '100%', width: '100%', minHeight: '500px' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sources.map((source) => (
          <WaterSourceMarker
            key={source.id}
            source={source}
            onClick={onSourceClick}
          />
        ))}

        <MapLegend />
      </MapContainer>
    </div>
  );
}
