
// src/graphql/queries/affordability.ts


import { gql } from '@apollo/client';

export const CALCULATE_AFFORDABILITY = gql`
  query CalculateAffordability(
    $occupation: String!
    $education: String!
    $experience: String!
    $location: String!
  ) {
    calculateAffordability(
      occupation: $occupation
      education: $education
      experience: $experience
      location: $location
    ) {
      success
      message
      location
      salary {
        min
        max
        average
      }
      expenses {
        rent {
          amount
          percent
        }
        food {
          amount
          percent
        }
        transport {
          amount
          percent
        }
        utility {
          amount
          percent
        }
        total {
          amount
          percent
        }
      }
      savings {
        amount
        percent
        disposableIncome
        emergencyFund
      }
      affordabilityRating
      summary
    }
  }
`;