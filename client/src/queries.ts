import { gql } from "@apollo/client";

export const GET_REPOSITORIES = gql`
  query GetRepositories($filter: String) {
    repositories(filter: $filter) {
      name
      size
      owner
    }
  }
`;

export const GET_REPOSITORY_DETAILS = gql`
  query GetRepositoryDetails($owner: String!, $repository: String!) {
    repositoryDetails(owner: $owner, repository: $repository) {
      name
      size
      owner
      numberOfFiles
      visibility
      ymlFileContent
      webhooks {
        id
        name
        events
        createdAt
        updatedAt
      }
    }
  }
`;
