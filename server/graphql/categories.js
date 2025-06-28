export const typeDef = `
    type Category {
        id: Int!
        name: String! 
    } 
    extend type Query {
        categories: [Category]
    }
`;

export const resolvers = {
  Query: {
    categories: (parent, args, context, info) => {
      return context.db.categories.getAll();
    },
  },
};