export const typeDef = `
    type Order {
        id: Int!
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
        order(id: Int!): Order
    }

    extend type Mutation {
        createOrder(input: OrderInput!): Order
        updateOrder(id: Int!, input: OrderInput!): Order
        deleteOrder(id: Int!): Int
    }
`;

export const resolvers = {
    Query: {
        orders: (parent, args, context, info) => {
            return context.db.orders.getAll();
        },
        order: (parent, args, context, info) => {
            return context.db.orders.findById(args.id);
        },
    },
    Mutation: {
        createOrder: (parent, args, context, info) => {
            return context.db.orders.create(args.input);
        },
        updateOrder: (parent, args, context, info) => {
            return context.db.orders.update(args.id, args.input);
        },
        deleteOrder: (parent, args, context, info) => {
            return context.db.orders.delete(args.id);
        },
    },
};