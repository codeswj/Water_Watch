// Format a date string to readable format
export const formatDate = (dateStr) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-KE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

// Capitalise first letter
export const capitalise = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).replace(/_/g, ' ');
};

// Return tailwind badge class based on status / severity
export const getBadgeClass = (value) => {
  const map = {
    safe:      'badge-safe',
    unsafe:    'badge-unsafe',
    unknown:   'badge-unknown',
    low:       'badge-low',
    medium:    'badge-medium',
    high:      'badge-high',
    pending:   'badge-pending',
    verified:  'badge-verified',
    dismissed: 'badge-dismissed',
  };
  return `badge ${map[value] || 'bg-gray-100 text-gray-700'}`;
};

// Truncate long text
export const truncate = (text, maxLength = 80) => {
  if (!text) return '';
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
};

// Get token from localStorage
export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
};

// Save token to localStorage
export const saveToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Remove token
export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

// Save user to localStorage
export const saveUser = (user) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Get user from localStorage
export const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  } catch {
    return null;
  }
};
