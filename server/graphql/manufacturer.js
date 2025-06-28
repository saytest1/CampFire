export const typeDef = `
    type Manufacturer {
        id: ID!
        name: String!
    }

    input ManufacturerInput {
        name: String!
    }

    extend type Query {
        manufacturers: [Manufacturer]
        manufacturer(id: ID!): Manufacturer
    }

    extend type Mutation {
        createManufacturer(input: ManufacturerInput!): Manufacturer
        updateManufacturer(id: ID!, input: ManufacturerInput!): Manufacturer
        deleteManufacturer(id: ID!): Int
    }
`;

export const resolvers = {
    Query: {
        manufacturers: (parent, args, context, info) => {
            return context.db.manufacturers.getAll();
        },
        manufacturer: (parent, args, context, info) => {
            return context.db.manufacturers.findById(args.id);
        },
    },
    Mutation: {
        createManufacturer: (parent, args, context, info) => {
            return context.db.manufacturers.create(args.input);
        },
        updateManufacturer: (parent, args, context, info) => {
            return context.db.manufacturers.update(args.id, args.input);
        },
        deleteManufacturer: (parent, args, context, info) => {
            return context.db.manufacturers.delete(args.id);
        },
    },
};