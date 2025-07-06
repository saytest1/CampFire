import { gql } from "@apollo/client";

export const GET_ALL_MANUFACTURERS = gql`
  query GetAllManufacturers {
    manufacturers(first: 10, offset: 0) {
      nodes {
        _id
        name
      }
    }
  }
`;

export const GET_MANUFACTURER_BY_ID = gql`
  query GetManufacturerById($id: ID!) {
    manufacturer(id: $id) {
      _id
      name
    }
  }
`;

export const CREATE_MANUFACTURER = gql`
  mutation CreateManufacturer($input: CreateManufacturerInput!) {
    createManufacturer(input: $input) {
      manufacturer {
        _id
        name
      }
    }
  }
`;

export const UPDATE_MANUFACTURER = gql`
  mutation UpdateManufacturer($input: UpdateManufacturerInput!) {
    updateManufacturer(input: $input) {
      manufacturer {
        _id
        name
      }
    }
  }
`;

export const DELETE_MANUFACTURER = gql`
  mutation DeleteManufacturer($input: DeleteManufacturerInput!) {
    deleteManufacturer(input: $input) {
      success
    }
  }
`;
