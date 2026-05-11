
// src/graphql/queries/salary.ts

import { gql } from '@apollo/client';

export const GET_SALARY_RANGE = gql`
  query GetSalaryRange($occupation: String!, $education: String!, $experience: String!) {
    salaryRange(occupation: $occupation, education: $education, experience: $experience) {
      success
      message
      data {
        occupation
        education
        experience
        minSalary
        maxSalary
      }
    }
  }
`;

export const GET_ALL_OCCUPATIONS = gql`
  query GetAllOccupations {
    occupations {
      id
      name
    }
  }
`;

export const GET_ALL_EDUCATION_LEVELS = gql`
  query GetAllEducationLevels {
    educationLevels {
      id
      name
    }
  }
`;

export const GET_ALL_EXPERIENCE_LEVELS = gql`
  query GetAllExperienceLevels {
    experienceLevels {
      id
      name
    }
  }
`;

export const GET_POPULAR_OCCUPATIONS = gql`
  query GetPopularOccupations($limit: Int) {
    popularOccupations(limit: $limit) {
      id
      name
      searchCount
      averageSalary
    }
  }
`;

// Search occupations - only id and name (no category)
export const SEARCH_OCCUPATIONS = gql`
  query SearchOccupations($searchTerm: String!, $limit: Int) {
    searchOccupations(searchTerm: $searchTerm, limit: $limit) {
      id
      name
    }
  }
`;