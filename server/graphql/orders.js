export const typeDef = `
    type Order {
        id: ID!
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
        order(id: ID!): Order
    }

    extend type Mutation {
        createOrder(input: OrderInput!): Order
        updateOrder(id: ID!, input: OrderInput!): Order
        deleteOrder(id: ID!): Int
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