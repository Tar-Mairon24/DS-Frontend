export interface Property {
  id: number;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  construction_m2: number;
  city: string;
  neighborhood: string;
  property_type: string;
  transaction_type: string;
  status: string;
  created_at: string;
  image?: string;
}
