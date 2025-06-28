export const typeDef = `
    type Category {
        id: Int!
        name: String! 
    } 

    input CategoryInput {
        name: String!
    }

    extend type Query {
        categories: [Category]
        category(id: Int!): Category
    }

    extend type Mutation {
        createCategory(input: CategoryInput!): Category
        updateCategory(id: Int!, input: CategoryInput!): Category
        deleteCategory(id: Int!): Int
    }
`;

export const resolvers = {
  Query: {
    categories: (parent, args, context, info) => {
      return context.db.categories.getAll();
    },
    category: (parent, args, context, info) => {
      return context.db.categories.findById(args.id);
    },
  },

  Mutation: {
    createCategory: (parent, args, context, info) => {
      return context.db.categories.create(args.input.name);
    },
    updateCategory: (parent, args, context, info) => {
      return context.db.categories.update(args.id, args.input);
    },
    deleteCategory: (parent, args, context, info) => {
      return context.db.categories.deleteById(args.id);
    },
  },
};