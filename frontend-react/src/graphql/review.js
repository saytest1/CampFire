import { gql } from "@apollo/client";

export const GET_ALL_REVIEWS = gql`
  query GetAllReviews {
    reviews(first: 10, offset: 0) {
      nodes {
        _id
        customerId
        productId
        rating
        comment
        imageFile
      }
    }
  }
`;

export const CREATE_REVIEW = gql`
    mutation CreateReview($input: CreateReviewInput!) {
        createReview(input: $input) {
            review {
                _id
                customerId
                productId
                rating
                comment
                imageFile
            }
        }
    }
`;

export const UPDATE_REVIEW = gql`
    mutation UpdateReview($input: UpdateReviewInput!) {
        updateReview(input: $input) {
            review {
                _id
                customerId
                productId
                rating
                comment
                imageFile
            }
        }
    }
`;

export const DELETE_REVIEW = gql`
    mutation DeleteReview($input: DeleteReviewInput!) {
        deleteReview(input: $input) {
            success
        }
    }
`;  