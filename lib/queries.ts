// Product Queries
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

export const featuredProductsQuery = `*[_type == "products" && "featured" in tags]{
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
  tags,
  category->{
    _id,
    title
  }
}`;

export const productsByCategoryQuery = (categoryId: string) => `*[_type == "products" && category._ref == "${categoryId}"]{
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

export const relatedProductsQuery = (productId: string) => `*[_type == "products" && _id != "${productId}"] {
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
}[0...4]`;

export const searchProductsQuery = (searchTerm: string) => `*[_type == "products" && (
  title match "*${searchTerm}*" || 
  description match "*${searchTerm}*"
)]{
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

// Category Queries
export const categoriesQuery = `*[_type == "categories"]{
  _id,
  title,
  "image": image.asset->url,
  "products": count(*[_type == "products" && references(^._id)])
}`;

export const categoryByIdQuery = (id: string) => `*[_type == "categories" && _id == "${id}"][0]{
  _id,
  title,
  "image": image.asset->url,
  "products": count(*[_type == "products" && references(^._id)])
}`; 