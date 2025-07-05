export const typeDef = `
    type Review {
        _id: ID!
        customerId: ID!
        productId: ID!
        productName: String!
        rating: Int!
        comment: String!
        createdAt: String!
        updatedAt: String!
        imageFile: String
    }

    input CreateReviewInput {
        customerId: ID!
        productId: ID!
        rating: Int!
        comment: String!
        imageFile: String
    }

    input UpdateReviewInput {
        _id: ID!
        rating: Int
        comment: String
        imageFile: String
    }


    enum ReviewsOrderBy {
        ID_ASC
        ID_DESC
        CUSTOMER_ID_ASC
        CUSTOMER_ID_DESC
        PRODUCT_ID_ASC
    }

    type ReviewConnection {
        nodes: [Review]
        totalCount: Int
    }

    input ReviewConnectionInput {
        customerId: ID
        productId: ID
        rating: RangeConditionInput
    }


    extend type Query {
        reviews(
            first: Int
            offset: Int
            condition: ReviewConnectionInput
            orderBy: [ReviewsOrderBy!] = ID_ASC
        ): ReviewConnection
        review(_id: ID!): Review
        reviewByProductIdCustomerId(productId: ID!, customerId: ID!): Review
    }

    extend type Mutation {
        createReview(input: CreateReviewInput!): Review
        updateReview(_id: ID!, input: UpdateReviewInput!): Review
        deleteReview(_id: ID!): Int
    }
`;

export const resolvers = {
    Query: {
        reviews: async (parent, args, context, info) => {
            const { items, totalCount } = await context.db.reviews.getAll(args);
            return {
                nodes: items,
                totalCount: totalCount,
            };
        },
        reviewByProductIdCustomerId: async (parent, args, context, info) => {
            const review = await context.db.reviews.findByProductIdCustomerId(args.productId, args.customerId);
            return review;
        },
    },
    Mutation: {
        createReview: async (parent, args, context, info) => {
            const review = await context.db.reviews.create(args);
            return review;
        },
        updateReview: async (parent, args, context, info) => {
            const review = await context.db.reviews.update(args);
            return review;
        },
        deleteReview: async (parent, args, context, info) => {
            const review = await context.db.reviews.delete(args);
            return review;
        },
    },
};