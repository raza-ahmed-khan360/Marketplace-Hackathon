export interface Product {
  _id: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  status?: string;
  inventory: number;
  tags?: string[];
  category?: {
    _id: string;
    title: string;
  };
}

export interface Category {
  _id: string;
  title: string;
  image: string;
  products: number;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
} 