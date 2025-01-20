import { type SchemaTypeDefinition } from "sanity";
import { productSchema } from "./products";
import { categorySchema } from "./categories";
import product from './product'
import category from './category'
import user from './user'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [productSchema, categorySchema, product, category, user],
};

export const schemaTypes = [product, category, user]