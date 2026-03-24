import { User } from "./user";

export interface PropertyCard {
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
  main_image_path?: string;
}

export interface Property {
  id: number;
  title: string;
  address: string;
  neighborhood: string;
  city: string;
  zone: string;
  reference: string;
  price: number;
  construction_m2: number;
  land_m2: number;
  is_occupied: boolean;
  is_furnished: boolean;
  floors: number;
  bedrooms: number;
  bathrooms: number;
  garage_size: number;
  garden_m2: number;
  gas_types: string[];
  amenities: string[];
  extras: string[];
  utilities: string[];
  notes: string;
  owner_id: number;
  user_id: number;
  property_type: PropertyType;
  transaction_type: TransactionType;
  status: PropertyStatus;
  created_at: string | Date;
  updated_at?: string | Date | null;
  owner?: User | null;
  users?: User[];
}

export enum PropertyType {
  Casa = 'Casa',
  Apartamento = 'Apartamento',
  Terreno = 'Terreno',
  Comercial = 'Comercial',
  Almacén = 'Almacén',
  Oficina = 'Oficina',
  Industrial = 'Industrial',
  Otro = 'Otro',
}

export enum TransactionType {
  Venta = 'Venta',
  Renta = 'Renta',
}

export enum PropertyStatus {
  Disponible = 'Disponible',
  Vendido = 'Vendido',
  Alquilado = 'Alquilado',
  Reservado = 'Reservado',
}

export const DEFAULT_PROPERTY_TYPE = PropertyType.Casa;
export const DEFAULT_TRANSACTION_TYPE = TransactionType.Venta;
export const DEFAULT_STATUS = PropertyStatus.Disponible;
