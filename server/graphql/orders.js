export const typeDef = `
    type Order {
        _id: ID!
        customerId: Int!
        orderDate: String!
        totalAmount: Float!
    }

    input OrderInput {
        customerId: Int!
        orderDate: String!
        totalAmount: Float!
    }

    extend type Query {
        orders: [Order]
        order(_id: ID!): Order
    }

    extend type Mutation {
        createOrder(input: OrderInput!): Order
        updateOrder(_id: ID!, input: OrderInput!): Order
        deleteOrder(_id: ID!): Int
    }
`;

export const resolvers = {
    Query: {
        orders: (parent, args, context, info) => {
            return context.db.orders.getAll();
        },
        order: (parent, args, context, info) => {
            return context.db.orders.findById(args._id);
        },
    },
    Mutation: {
        createOrder: (parent, args, context, info) => {
            return context.db.orders.create(args.input);
        },
        updateOrder: (parent, args, context, info) => {
            return context.db.orders.updateById(args._id, args.input);
        },
        deleteOrder: (parent, args, context, info) => {
            return context.db.orders.deleteById(args._id);
        },
    },
};