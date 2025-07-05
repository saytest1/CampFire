import { gql } from "@apollo/client";

export const GET_ALL_CATEGORIES = gql`
  query GetAllCategories {
    categories(first: 100, offset: 0) {
      nodes {
        _id
        name
      }
    }
  }
`;
