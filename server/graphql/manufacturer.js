export const typeDef = `
    type Manufacturer {
        _id: ID!
        name: String!
    }

    input ManufacturerInput {
        name: String!
    }

    extend type Query {
        manufacturers: [Manufacturer]
        manufacturer(_id: ID!): Manufacturer
    }

    extend type Mutation {
        createManufacturer(input: ManufacturerInput!): Manufacturer
        updateManufacturer(_id: ID!, input: ManufacturerInput!): Manufacturer
        deleteManufacturer(_id: ID!): Int
    }
`;

export const resolvers = {
    Query: {
        manufacturers: (parent, args, context, info) => {
            return context.db.manufacturers.getAll();
        },
        manufacturer: (parent, args, context, info) => {
            return context.db.manufacturers.findById(args._id);
        },
    },
    Mutation: {
        createManufacturer: (parent, args, context, info) => {
            return context.db.manufacturers.create(args.input);
        },
        updateManufacturer: (parent, args, context, info) => {
            return context.db.manufacturers.updateById(args._id, args.input);
        },
        deleteManufacturer: (parent, args, context, info) => {
            return context.db.manufacturers.deleteById(args._id);
        },
    },
};