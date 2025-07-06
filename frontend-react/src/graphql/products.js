import { gql } from "@apollo/client";

export const GET_ALL_PRODUCTS = gql`
  query GetAllProducts($first: Int, $offset: Int, $condition: ProductConnectionInput, $orderBy: [ProductsOrderBy!]) {
    products(first: $first, offset: $offset, condition: $condition, orderBy: $orderBy) {
      nodes {
        _id
        name
        price
        categoryId
        categoryName
        manufacturerId
        manufacturerName
        imageUrl
      }
      totalCount
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($categoryId: ID!, $first: Int, $offset: Int) {
    products(first: $first, offset: $offset, condition: { categoryId: $categoryId }) {
      nodes {
        _id
        name
        price
        categoryId
        categoryName
        manufacturerId
        manufacturerName
        imageUrl
      }
      totalCount
    }
  }
`;

export const GET_PRODUCTS_BY_CATEGORY_WITH_PAGINATION = gql`
  query ProductsByCategory($categoryId: ID!) {
    productsByCategory(categoryId: $categoryId) {
      nodes {
        _id
        name
        price
        imageUrl
      }
      totalCount
    }
  }
`;

export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      _id
      name
      price
      categoryId
      manufacturerId
      imageUrl
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($_id: ID!, $input: ProductInput!) {
    updateProduct(_id: $_id, input: $input) {
      _id
      name
      price
      categoryId
      manufacturerId
      imageUrl
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($_id: ID!) {
    deleteProduct(_id: $_id)
  }
`;
