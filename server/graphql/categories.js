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
        category(_id: ID!): Category
    }

    extend type Mutation {
        createCategory(input: CategoryInput!): Category
        updateCategory(_id: ID!, input: CategoryInput!): Category
        deleteCategory(_id: ID!): Int
    }
`;

export const resolvers = {
  Query: {
    categories: (parent, args, context, info) => {
      return context.db.categories.getAll();
    },
    category: (parent, args, context, info) => {
      return context.db.categories.findById(args._id);
    },
  },

  Mutation: {
    createCategory: (parent, args, context, info) => {
      return context.db.categories.create(args.input);
    },
    updateCategory: (parent, args, context, info) => {
      return context.db.categories.updateById(args._id, args.input);
    },
    deleteCategory: (parent, args, context, info) => {
      return context.db.categories.deleteById(args._id);
    },
  },
};