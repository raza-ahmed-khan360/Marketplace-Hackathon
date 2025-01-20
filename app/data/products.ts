export interface Product {
  id: string;
  title: string;
  price: number;
  oldPrice?: number;
  image: string;
  description: string;
  status?: 'New' | 'Sale';
}

export const products: Product[] = [
  {
    id: '1',
    title: 'Library Stool Chair',
    price: 20,
    oldPrice: 39,
    image: '/allProducts/Image.png',
    description: 'A comfortable and stylish library stool chair perfect for reading corners and study spaces.',
    status: 'New'
  },
  {
    id: '2',
    title: 'Modern Lounge Chair',
    price: 20,
    oldPrice: 39,
    image: '/allProducts/Image (2).png',
    description: 'Contemporary lounge chair with elegant design and premium comfort.',
    status: 'Sale'
  },
  {
    id: '3',
    title: 'Classic Wooden Chair',
    price: 20,
    image: '/allProducts/Image (4).png',
    description: 'Traditional wooden chair crafted with attention to detail and durability.'
  },
  {
    id: '4',
    title: 'Modern Dining Chair',
    price: 20,
    image: '/allProducts/Image (6).png',
    description: 'Sleek dining chair that combines style with functionality.'
  },
  {
    id: '5',
    title: 'Accent Chair',
    price: 20,
    oldPrice: 39,
    image: '/allProducts/Image (1).png',
    description: 'Beautiful accent chair that adds character to any room.',
    status: 'New'
  },
  {
    id: '6',
    title: 'Office Chair',
    price: 20,
    oldPrice: 39,
    image: '/allProducts/Image (3).png',
    description: 'Ergonomic office chair designed for comfort during long work hours.',
    status: 'Sale'
  },
  {
    id: '7',
    title: 'Recliner Chair',
    price: 20,
    image: '/allProducts/Image (5).png',
    description: 'Comfortable recliner perfect for relaxation and leisure time.'
  },
  {
    id: '8',
    title: 'Outdoor Chair',
    price: 20,
    image: '/allProducts/Image (7).png',
    description: 'Weather-resistant outdoor chair ideal for garden and patio use.'
  }
]; 