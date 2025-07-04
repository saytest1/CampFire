import { createSchema } from "graphql-yoga";
import _ from "lodash";

// hello
import {typeDef as hello, resolvers as helloResolvers,} from "./hello.js";

// shop
import {typeDef as categories, resolvers as categoriesResolvers,} from "./categories.js";
import {typeDef as products, resolvers as productsResolvers,} from "./products.js";
import {typeDef as manufacturers, resolvers as manufacturersResolvers,} from "./manufacturer.js";
import {typeDef as details, resolvers as detailsResolvers,} from "./detail.js";
import {typeDef as orders, resolvers as ordersResolvers,} from "./orders.js";
import {typeDef as upload, resolvers as uploadResolvers,} from "./upload.js";
import {typeDef as authentication, resolvers as authenticationResolvers,} from "./authentication.js";

const query = `
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;
const typeDefs = [query, hello, categories, products, manufacturers, details, orders, upload, authentication];
const resolvers = _.merge(helloResolvers, categoriesResolvers, productsResolvers, manufacturersResolvers, detailsResolvers, ordersResolvers, uploadResolvers, authenticationResolvers);

export const schema = createSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
