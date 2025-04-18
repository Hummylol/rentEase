import { Vehicle } from '@/types/rental';

export const BIKES: Vehicle[] = [
  {
    id: '1',
    name: 'Royal Enfield Classic 350',
    price: '700',
    image: 'https://images.unsplash.com/photo-1622547918989-02ebc7a89eb0?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    type: 'Cruiser',
    specs: {
      engine: '349cc',
      power: '20.2 bhp',
      mileage: '35 kmpl',
    },
    contactNumber: '+91 98765 43210',
  },
  {
    id: '2',
    name: 'KTM Duke 390',
    price: '1200',
    image: 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=500',
    type: 'Sports',
    specs: {
      engine: '373cc',
      power: '43.5 bhp',
      mileage: '28 kmpl',
    },
  },
  {
    id: '3',
    name: 'Yamaha R15 V4',
    price: '900',
    image: 'https://images.unsplash.com/photo-1547549082-6bc09f2049ae?w=500',
    type: 'Sports',
    specs: {
      engine: '155cc',
      power: '18.4 bhp',
      mileage: '40 kmpl',
    },
  },
  {
    id: '4',
    name: 'Bajaj Pulsar NS200',
    price: '800',
    image: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?w=500',
    type: 'Sports',
    specs: {
      engine: '199.5cc',
      power: '24.5 bhp',
      mileage: '35 kmpl',
    },
    contactNumber: '+91 98765 43211',
  },
];