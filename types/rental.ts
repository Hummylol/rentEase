export interface Vehicle {
  id: string;
  name: string;
  image: string;
  price: number;
  type: 'car' | 'bike';
  description: string;
  specs: {
    transmission?: string;
    mileage?: string;
    seats?: number;
    fuelType?: string;
    engine?: string;
    type?: string;
  };
  problems?: string;
  isRegistered?: boolean;
  extraFittings?: string[];
  contactNumber?: string;
}

export interface Apartment {
  id: string;
  name: string;
  image: string;
  price: number;
  description: string;
  address: string;
  specs: {
    bedrooms: number;
    bathrooms: number;
    area: number;
    floor?: number;
    furnished?: boolean;
    parking?: boolean;
    amenities?: string[];
  };
  contactNumber?: string;
}

export interface BookingHistory {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'car' | 'bike' | 'apartment';
  itemName: string;
  itemImage: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}