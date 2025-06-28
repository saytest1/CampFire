export const typeDef = `
    type Detail {
        id: Int!
        name: String!
        orderId: Int!
        productId: Int!
        quantity: Int!
        price: Float!
    }

    input DetailInput {
        orderId: Int!
        productId: Int!
        quantity: Int!
        price: Float!
    }

    extend type Query {
        details: [Detail]
        detail(id: Int!): Detail
    }

    extend type Mutation {
        createDetail(input: DetailInput!): Detail
        updateDetail(id: Int!, input: DetailInput!): Detail
        deleteDetail(id: Int!): Int
    }
`;

export const resolvers = {
    Query: {
        details: (parent, args, context, info) => {
            return context.db.details.getAll();
        },
        detail: (parent, args, context, info) => {
            return context.db.details.findById(args.id);
        },
    },
    Mutation: {
        createDetail: (parent, args, context, info) => {
            return context.db.details.create(args.input);
        },
        updateDetail: (parent, args, context, info) => {
            return context.db.details.update(args.id, args.input);
        },
        deleteDetail: (parent, args, context, info) => {
            return context.db.details.delete(args.id);
        },
    },
};