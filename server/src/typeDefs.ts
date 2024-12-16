const typedDefs = `#graphql
type Repository {
  name: String!
  size: Int!
  owner: String!
}

type RepositoryDetails {
  name: String!
  size: Int!
  owner: String!
  visibility: String!
  webhooks: [RepositoryWehbook!]!
  numberOfFiles: Int!
  ymlFileContent: String!
}

type RepositoryWehbook {
  id: ID!
  name: String!
  events: [String!]!
  createdAt: String!
  updatedAt: String!
}

type Query {
  repositories(filter: String): [Repository!]!
  repositoryDetails(owner: String!, repository: String!): RepositoryDetails
}
`;

export default typedDefs;
