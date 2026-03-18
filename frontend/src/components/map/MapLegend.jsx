'use client';

import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';

export default function MapLegend() {
  const map = useMap();
  const legendRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const L = require('leaflet');

    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
      const div = L.DomUtil.create('div', '');
      div.innerHTML = `
        <div style="background:white;padding:10px 14px;border-radius:8px;box-shadow:0 1px 6px rgba(0,0,0,0.15);font-size:12px;line-height:1.8;">
          <strong style="display:block;margin-bottom:6px;color:#374151;">Legend</strong>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="width:12px;height:12px;background:#22c55e;border-radius:50%;display:inline-block;"></span> Safe
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="width:12px;height:12px;background:#ef4444;border-radius:50%;display:inline-block;"></span> Unsafe
          </div>
          <div style="display:flex;align-items:center;gap:6px;">
            <span style="width:12px;height:12px;background:#f59e0b;border-radius:50%;display:inline-block;"></span> Unknown
          </div>
        </div>`;
      return div;
    };

    legend.addTo(map);
    return () => legend.remove();
  }, [map]);

  return null;
}
