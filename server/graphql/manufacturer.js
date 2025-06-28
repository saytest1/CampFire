export const typeDef = `
    type Manufacturer {
        id: Int!
        name: String!
    }

    input ManufacturerInput {
        name: String!
    }

    extend type Query {
        manufacturers: [Manufacturer]
        manufacturer(id: Int!): Manufacturer
    }

    extend type Mutation {
        createManufacturer(input: ManufacturerInput!): Manufacturer
        updateManufacturer(id: Int!, input: ManufacturerInput!): Manufacturer
        deleteManufacturer(id: Int!): Int
    }
`;

export const resolvers = {
    Query: {
        manufacturers: (parent, args, context, info) => {
            return context.db.manufacturers.getAll();
        },
    },
};