export const typeDef = `
  type Category {
    _id: ID!
    name: String!
  }

  input CategoryInput {
    name: String!
  }

  extend type Query {
    categories: [Category]
    category(id: ID!): Category
  }

  extend type Mutation {
    deleteCategory(id: ID!): Int
    createCategory(input: CategoryInput!): Category
    updateCategory(id: ID!, input: CategoryInput!): Category
  }
`;

export const resolvers = {
  Query: {
    categories: (parent, args, context) => {
      return context.db.categories.getAll();
    },
    category: (parent, args, context) => {
      return context.db.categories.findById(args.id); // dùng args.id thay vì args.byId
    },
  },
  Mutation: {
    deleteCategory: (parent, args, context) => {
      return context.db.categories.deleteById(args.id);
    },
    createCategory: (parent, args, context) => {
      return context.db.categories.create(args.input);
    },
    updateCategory: (parent, args, context) => {
      return context.db.categories.updateById(args.id, args.input);
    },
  },
};
