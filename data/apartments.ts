import { Apartment } from '@/types/rental';

export const APARTMENTS: Apartment[] = [
  {
    id: '1',
    name: 'Luxury 2BHK Apartment',
    price: 5000,
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500',
    description: 'A modern 2BHK apartment with premium amenities and great location.',
    specs: {
      bedrooms: '2',
      bathrooms: '2',
      area: '1200 sq ft',
    },
    contactNumber: '+91 98765 43216',
  },
  {
    id: '2',
    name: 'Studio Apartment',
    price: 3000,
    type: 'Studio',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500',
    description: 'Cozy studio apartment perfect for singles or couples.',
    specs: {
      bedrooms: '1',
      bathrooms: '1',
      area: '600 sq ft',
    },
    contactNumber: '+91 98765 43217',
  },
  {
    id: '3',
    name: '3BHK Penthouse',
    price: 8000,
    type: 'Penthouse',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500',
    description: 'Luxurious penthouse with panoramic views and premium amenities.',
    specs: {
      bedrooms: '3',
      bathrooms: '3',
      area: '2000 sq ft',
    },
    contactNumber: '+91 98765 43218',
  },
];