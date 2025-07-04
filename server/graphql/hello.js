export const typeDef = `
    type Query {
        hello: String
    }
`;

export const resolvers = {
    Query: {
        hello: () => "Hello World"
    }
};