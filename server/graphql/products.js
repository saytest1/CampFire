export const typeDef = `
    type Product {
        id: ID!
        name: String!
        price: Float!
        categoryId: Int!
        manufacturerId: Int!
    }

    input ProductInput {
        name: String!
        price: Float!
        categoryId: Int!
        manufacturerId: Int!
    }

    extend type Query {
        products: [Product]
        product(id: ID!): Product
    }

    extend type Mutation {
        createProduct(input: ProductInput!): Product
        updateProduct(id: ID!, input: ProductInput!): Product
        deleteProduct(id: ID!): Int
    }
`;

export const resolvers = {
    Query: {
        products: (parent, args, context, info) => {
            return context.db.products.getAll();
        },
        product: (parent, args, context, info) => {
            return context.db.products.findById(args.id);
        },
    },
    Mutation: {
        createProduct: (parent, args, context, info) => {
            return context.db.products.create(args.input);
        },
        updateProduct: (parent, args, context, info) => {
            return context.db.products.update(args.id, args.input);
        },
        deleteProduct: (parent, args, context, info) => {
            return context.db.products.deleteById(args.id);
        },
    },
};