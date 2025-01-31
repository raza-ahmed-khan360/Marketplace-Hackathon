import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-03-13',
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

const imageBuilder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return imageBuilder.image(source);
}

// Queries
export const productsQuery = `*[_type == "products"]{
  _id,
  title,
  price,
  "oldPrice": priceWithoutDiscount,
  "image": image.asset->url,
  description,
  "status": badge,
  inventory,
  tags,
  category->{
    _id,
    title
  }
}`;

export const categoriesQuery = `*[_type == "categories"]{
  _id,
  title,
  "image": image.asset->url,
  products
}`;

export const featuredProductsQuery = `*[_type == "products" && "featured" in tags]{
  _id,
  title,
  price,
  "oldPrice": priceWithoutDiscount,
  "image": image.asset->url,
  description,
  "status": badge,
  inventory
}[0...4]`;

export const productByIdQuery = (id: string) => `*[_type == "products" && _id == "${id}"][0]{
  _id,
  title,
  price,
  "oldPrice": priceWithoutDiscount,
  "image": image.asset->url,
  description,
  "status": badge,
  inventory,
  category->{
    _id,
    title
  }
}`;

export async function insertOrderIntoSanity(orderData: any) {
    const doc: any = {
        _type: 'order',
        ...orderData,
    };

    try {
        return await client.create(doc);
    } catch (error) {
        console.error('Error inserting order into Sanity:', error);
        throw new Error('Failed to insert order into Sanity');
    }
}

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});