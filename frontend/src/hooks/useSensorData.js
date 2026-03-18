import { useState, useEffect } from 'react';
import { sensorReadingsAPI } from '@/lib/api';

const useSensorData = (sourceId) => {
  const [readings, setReadings] = useState([]);
  const [latest, setLatest]     = useState(null);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!sourceId) return;

    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const [readingsRes, latestRes] = await Promise.all([
          sensorReadingsAPI.getBySource(sourceId, { limit: 20 }),
          sensorReadingsAPI.getLatestBySource(sourceId),
        ]);
        setReadings(readingsRes.data.readings || []);
        setLatest(latestRes.data.reading || null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch sensor data.');
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [sourceId]);

  return { readings, latest, loading, error };
};

export default useSensorData;
