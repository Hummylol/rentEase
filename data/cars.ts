import { Vehicle } from '@/types/rental';

export const CARS: Vehicle[] = [
  {
    id: '1',
    name: 'Tata Nexon',
    price: '2500',
    image: 'https://images.unsplash.com/photo-1628573042918-a91e94c2c906?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    type: 'SUV',
    specs: {
      engine: '1.2L Turbo',
      transmission: 'Automatic',
      fuel: 'Petrol',
    },
    contactNumber: '+91 98765 43213',
  },
  {
    id: '2',
    name: 'Hyundai Creta',
    price: '3000',
    image: 'https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=500',
    type: 'SUV',
    specs: {
      engine: '1.5L',
      transmission: 'Manual',
      fuel: 'Diesel',
    },
    contactNumber: '+91 98765 43214',
  },
  {
    id: '3',
    name: 'Maruti ignis',
    price: '1800',
    image: 'https://images.unsplash.com/photo-1627907361729-3f084212cf96?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    type: 'Hatchback',
    specs: {
      engine: '1.2L',
      transmission: 'Manual',
      fuel: 'Petrol',
    },
    contactNumber: '+91 98765 43215',
  },
];