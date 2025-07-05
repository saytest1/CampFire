import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts {
    products(first: 22, offset: 0) {
      nodes {
        _id
        name
      }
    }
  }
`;

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      _id
      name
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      product {
        _id
        name
      }
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      product {
        _id
        name
      }
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($input: DeleteProductInput!) {
    deleteProduct(input: $input) {
      success
    }
  }
`;
