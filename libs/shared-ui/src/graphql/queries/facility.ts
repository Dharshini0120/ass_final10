import { gql } from '@apollo/client';

export const GET_FACILITY_TYPES = gql`
  query GetFacilityTypes {
    getFacilityTypes {
      status
      message
      statusCode
      error
      data {
        name
        description
        isActive
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_SERVICE_LINES = gql`
  query GetServiceLines {
    getServiceLines {
      status
      message
      statusCode
      data
      error
    }
  }
`;

