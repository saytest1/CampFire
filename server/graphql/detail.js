export const typeDef = `
    type Detail {
        _id: ID!
        name: String!
        orderId: ID!
        productId: ID!
        quantity: Int!
        price: Float!
    }

    input DetailInput {
        orderId: ID!
        productId: ID!
        quantity: Int!
        price: Float!
    }

    extend type Query {
        details: [Detail]
        detail(_id: ID!): Detail
    }

    extend type Mutation {
        createDetail(input: DetailInput!): Detail
        updateDetail(_id: ID!, input: DetailInput!): Detail
        deleteDetail(_id: ID!): Int
    }
`;

export const resolvers = {
    Query: {
        details: (parent, args, context, info) => {
            return context.db.details.getAll();
        },
        detail: (parent, args, context, info) => {
            return context.db.details.findById(args._id);
        },
    },
    Mutation: {
        createDetail: (parent, args, context, info) => {
            return context.db.details.create(args.input);
        },
        updateDetail: (parent, args, context, info) => {
            return context.db.details.updateById(args._id, args.input);
        },
        deleteDetail: (parent, args, context, info) => {
            return context.db.details.deleteById(args._id);
        },
    },
};