
// src/graphql/queries/locations.ts

import { gql } from '@apollo/client';

export const GET_ALL_LOCATIONS = gql`
  query GetAllLocations {
    locations {
      id
      name
    }
  }
`;

export const GET_LOCATION_COST_OF_LIVING = gql`
  query GetLocationCostOfLiving($locationName: String!) {
    locationCostOfLiving(locationName: $locationName) {
      rentPercent
      foodPercent
      transportPercent
      utilityPercent
    }
  }
`;