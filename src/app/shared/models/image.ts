export interface Image {
  id: number;
  property_id: number;
  url: string;
  description: string;
  main_image: boolean;
  created_at: string;
  updated_at: string;
}

export interface PropertyImageMain {
  id: number;
  property_id: number;
  path: string;
  description: string;
}
