import { createSchema } from "graphql-yoga";
import _ from "lodash";

import {typeDef as categories, resolvers as categoriesResolvers,} from "./categories.js";

const query = `
  type Query {
    _empty: String
  }
`;
const typeDefs = [categories];
const resolvers = _.merge(categoriesResolvers);

export const schema = createSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});
