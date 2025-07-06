import { gql } from "@apollo/client";

export const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    orders(first: 10, offset: 0) {
      nodes {
        _id
        name
      }
    }
  }
`;

export const GET_ORDER_BY_ID = gql`
  query GetOrderById($id: ID!) {
    order(id: $id) {
      _id
      name
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      order {
        _id
        name
      }
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($input: UpdateOrderInput!) {
    updateOrder(input: $input) {
      order {
        _id
        name
      }
    }
  }
`;

export const DELETE_ORDER = gql`
  mutation DeleteOrder($input: DeleteOrderInput!) {
    deleteOrder(input: $input) {
      success
    }
  }
`;