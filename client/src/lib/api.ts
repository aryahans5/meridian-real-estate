import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('meridian_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export function formatPrice(price: number, listingType: string) {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(price);

  if (listingType === 'rent' || listingType === 'commercial') {
    return `${formatted}/mo`;
  }
  return formatted;
}

export function listingLabel(type: string) {
  switch (type) {
    case 'buy':
      return 'For Sale';
    case 'rent':
      return 'For Rent';
    case 'commercial':
      return 'Commercial';
    default:
      return type;
  }
}
