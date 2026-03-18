'use client';

import { createContext, useContext, useState } from 'react';

const MapContext = createContext(null);

export const MapProvider = ({ children }) => {
  const [selectedSource, setSelectedSource] = useState(null);
  const [filterStatus, setFilterStatus]     = useState('all');

  return (
    <MapContext.Provider value={{ selectedSource, setSelectedSource, filterStatus, setFilterStatus }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const ctx = useContext(MapContext);
  if (!ctx) throw new Error('useMap must be used within MapProvider');
  return ctx;
};
