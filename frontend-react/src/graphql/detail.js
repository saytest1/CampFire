import { gql } from "@apollo/client";

export const GET_ALL_DETAILS = gql`
  query GetAllDetails {
    details(first: 10, offset: 0) {
      nodes {
        _id
        name
      }
    }
  }
`;

export const GET_DETAIL_BY_ID = gql`
  query GetDetailById($id: ID!) {
    detail(id: $id) {
      _id
      name
    }
  }
`;

export const CREATE_DETAIL = gql`
  mutation CreateDetail($input: CreateDetailInput!) {
    createDetail(input: $input) {
      detail {
        _id
        name
      }
    }
  }
`;

export const UPDATE_DETAIL = gql`
  mutation UpdateDetail($input: UpdateDetailInput!) {
    updateDetail(input: $input) {
      detail {
        _id
        name
      }
    }
  }
`;

export const DELETE_DETAIL = gql`
  mutation DeleteDetail($input: DeleteDetailInput!) {
    deleteDetail(input: $input) {
      success
    }
  }
`;
