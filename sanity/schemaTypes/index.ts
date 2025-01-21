import { type SchemaTypeDefinition } from "sanity";
import { productSchema } from "./products";
import { categorySchema } from "./categories";
import product from './product'
import category from './category'
import user from './user'
import order from './order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productSchema, categorySchema, product, category, user, order],
};

export const schemaTypes = [product, category, user, order]