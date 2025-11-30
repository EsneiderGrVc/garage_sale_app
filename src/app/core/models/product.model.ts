export interface UseTime {
  value: number;
  unit: 'Meses' | 'Años';
}

export interface TotalLifetime {
  value: number;
  unit: 'Meses' | 'Años';
}

export type Condition = string;
export type InternalCategory = 'Venta' | 'Donación';
export type Status = 'Disponible' | 'Vendido' | 'Donado';

export interface Product {
  id?: string;
  name: string;
  reference?: string;
  category: string;
  condition: Condition;
  condition_scale: number;
  brand?: string;
  use_time: UseTime;
  purchase_date: string;
  total_lifetime: TotalLifetime;
  current_price: number;
  proposed_price: number;
  internal_category: InternalCategory;
  subcategory?: string;
  model?: string;
  market_link: string;
  images: string[];
  status: Status;
}

