export type Vehicle = {
  id: string;
  name: string;
  price: number;
  type: string;
  image: any;
  description: string;
  specs: {
    mileage?: string;
    engine?: string;
    transmission?: string;
    seats?: string;
    bedrooms?: string;
    bathrooms?: string;
    area?: string;
  };
  contactNumber: string;
}; 