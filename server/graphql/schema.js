import { createSchema } from "graphql-yoga";
import _ from "lodash";

import {typeDef as categories, resolvers as categoriesResolvers,} from "./categories.js";
import {typeDef as products, resolvers as productsResolvers,} from "./products.js";
import {typeDef as manufacturers, resolvers as manufacturersResolvers,} from "./manufacturer.js";
import {typeDef as details, resolvers as detailsResolvers,} from "./detail.js";
import {typeDef as orders, resolvers as ordersResolvers,} from "./orders.js";

const query = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;
const typeDefs = [query, categories, products, manufacturers, details, orders];
const resolvers = _.merge(categoriesResolvers, productsResolvers, manufacturersResolvers, detailsResolvers, ordersResolvers);

export const schema = createSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
