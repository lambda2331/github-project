import { GraphQLError } from "graphql";
import { ContextValue } from "./types.js";

const resolvers = {
  Query: {
    repositories: async (
      _,
      args: { filter?: string },
      { dataSource }: ContextValue
    ) => {
      const repositories = await dataSource.githubAPI.getRepositories();

      if (!args.filter) {
        return repositories;
      }

      const filter = args.filter.toLowerCase();

      return repositories.filter((item) =>
        item.name.toLowerCase().includes(filter)
      );
    },
    repositoryDetails: async (
      _,
      args: { owner: string; repository: string },
      { dataSource }: ContextValue
    ) => {
      const details = await dataSource.githubAPI.getRepositoryDetails(
        args.owner,
        args.repository
      );

      if (!details) {
        throw new GraphQLError("Details was not found!", {
          extensions: { code: "DETAILS_NOT_FOUND", ...args },
        });
      }

      return details;
    },
  },
};

export default resolvers;
