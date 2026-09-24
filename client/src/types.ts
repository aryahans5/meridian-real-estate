export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string;
}

export interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  listingType: 'buy' | 'rent' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  area: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  images: string[];
  features: string[];
  status: 'available' | 'pending' | 'sold' | 'rented';
  yearBuilt?: number;
  parking?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Appointment {
  _id: string;
  property: Property | string;
  user?: User | string;
  name: string;
  email: string;
  phone: string;
  preferredDate: string;
  preferredTime: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt?: string;
}

export interface PropertyFilters {
  q?: string;
  listingType?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  city?: string;
  page?: number;
}
