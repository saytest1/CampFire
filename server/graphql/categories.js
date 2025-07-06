export const typeDef = `
    type Category {
        _id: ID!
        name: String! 
    } 

    input CategoryInput {
        name: String!
    }

    extend type Query {
        categories(
          first: Int
          offset: Int
          orderBy: [CategoriesOrderBy!] = ID_ASC
        ): CategoryConnection
        category(_id: ID!): Category
    }

    extend type Mutation {
        createCategory(input: CategoryInput!): Category
        updateCategory(_id: ID!, input: CategoryInput!): Category
        deleteCategory(_id: ID!): Int
    }

    enum CategoriesOrderBy {
        ID_ASC
        ID_DESC
        NAME_ASC
        NAME_DESC
    }

    type CategoryConnection {
        nodes: [Category]
        totalCount: Int
    }

`;

export const resolvers = {
  Query: {
    categories: async (parent, args, context, info) => {
      const { items, totalCount } = await context.db.categories.getAll(args);
      return {
        nodes: items,
        totalCount: totalCount,
      };
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