export interface PropertyFormData {
  owner_id: number | null;
  images: any[];
  title: string;
  status: string;
  address: string;
  neighborhood: string;
  city: string;
  zone: string;
  reference: string;
  transaction_type: string;
  property_type: string;
  price: number;
  is_occupied: boolean;
  is_furnished: boolean;
  construction_m2: number;
  land_m2: number;
  garden_m2: number;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  garage_size: number;
  amenities: any[];
  utilities: any[];
  gas_types: any[];
  extras: any[];
  description: string;
  notes: string;
}
