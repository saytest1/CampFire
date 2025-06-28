import { createSchema } from "graphql-yoga";
import { GraphQLError } from "graphql";
import _ from "lodash";

const typeDefs = `
   type Query {
      hello: String
   }
`;

const resolvers = {
  Query: {
    hello: () => "Hello World!",
  },
};

export const schema = createSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});