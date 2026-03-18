export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const MAP_CENTER = {
  lat: parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LAT) || -1.2841,
  lng: parseFloat(process.env.NEXT_PUBLIC_MAP_CENTER_LNG) || 36.8155,
};

export const MAP_ZOOM = 11;

export const WATER_SOURCE_TYPES = ['borehole', 'river', 'well', 'spring', 'reservoir', 'other'];

export const SOURCE_STATUSES = ['safe', 'unsafe', 'unknown'];

export const REPORT_STATUSES = ['pending', 'verified', 'dismissed'];

export const ALERT_SEVERITIES = ['low', 'medium', 'high'];

export const USER_ROLES = ['public', 'field_officer', 'admin'];

export const STATUS_COLORS = {
  safe:    '#22c55e',
  unsafe:  '#ef4444',
  unknown: '#f59e0b',
};

export const SEVERITY_COLORS = {
  low:    '#3b82f6',
  medium: '#f97316',
  high:   '#ef4444',
};
