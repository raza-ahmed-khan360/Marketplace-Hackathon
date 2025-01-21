export interface Category {
  id: string;
  title: string;
  image: string;
  productsCount: number;
}

export const categories: Category[] = [
  {
    id: '1',
    title: 'Wing Chair',
    image: '/homepage/Top Categories/Image.png',
    productsCount: 3584
  },
  {
    id: '2',
    title: 'Wooden Chair',
    image: '/homepage/Top Categories/Image (1).png',
    productsCount: 157
  },
  {
    id: '3',
    title: 'Desk Chair',
    image: '/homepage/Top Categories/Image (2).png',
    productsCount: 154
  }
];