'use client';

import { Marker, Popup } from 'react-leaflet';
import { useEffect, useState } from 'react';
import { STATUS_COLORS } from '@/utils/constants';
import { capitalise, formatDate } from '@/utils/helpers';
import StatusBadge from '@/components/shared/StatusBadge';

const getColoredIcon = (status) => {
  if (typeof window === 'undefined') return null;
  const L = require('leaflet');
  const color = STATUS_COLORS[status] || STATUS_COLORS.unknown;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="36" viewBox="0 0 28 36">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 9.333 14 22 14 22S28 23.333 28 14C28 6.268 21.732 0 14 0z"
        fill="${color}" stroke="white" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="white"/>
    </svg>`;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize:   [28, 36],
    iconAnchor: [14, 36],
    popupAnchor:[0, -36],
  });
};

export default function WaterSourceMarker({ source, onClick }) {
  const [icon, setIcon] = useState(null);

  useEffect(() => {
    setIcon(getColoredIcon(source.status));
  }, [source.status]);

  if (!icon) return null;

  return (
    <Marker
      position={[parseFloat(source.latitude), parseFloat(source.longitude)]}
      icon={icon}
      eventHandlers={{ click: () => onClick && onClick(source) }}
    >
      <Popup>
        <div className="min-w-[180px] text-sm">
          <p className="font-semibold text-gray-800 mb-1">{source.name}</p>
          <p className="text-gray-500 mb-1">Type: {capitalise(source.type)}</p>
          <p className="mb-2">
            Status: <StatusBadge value={source.status} />
          </p>
          {source.created_at && (
            <p className="text-xs text-gray-400">Added: {formatDate(source.created_at)}</p>
          )}
        </div>
      </Popup>
    </Marker>
  );
}
