import { ApolloServer } from "@apollo/server";
import Bull from "bull";

import resolvers from "./resolvers.js";
import typeDefs from "./typeDefs.js";
import { ContextValue } from "./types.js";
import { GithubDatasource } from "./github-datasource.js";

const CONCURRENCY = +(process.env.QUEUE_CONCURRENCY || "1");
const githubPAT = process.env.GITHUB_ACCESS_TOKEN;
const queueName = "github-requests";

interface QueryReuqestBody {
  query: string;
  variables: Record<string, string>;
}

class AppoloService {
  #instance?: Bull.Queue;

  init(): void {
    const queueInstance = new Bull<QueryReuqestBody>(queueName);

    const server = new ApolloServer<ContextValue>({
      typeDefs,
      resolvers,
      includeStacktraceInErrorResponses: false,
    });

    queueInstance.process(CONCURRENCY, async ({ data }) => {
      if (!Object.keys(data).length) {
        return null;
      }

      const contextValue = {
        dataSource: {
          githubAPI: new GithubDatasource(githubPAT),
        },
      };

      const results = await server.executeOperation(
        {
          query: data.query,
          variables: data.variables,
        },
        {
          contextValue,
        }
      );

      return results.body.kind === "single"
        ? results.body.singleResult
        : results.body.initialResult;
    });

    this.#instance = queueInstance;
  }

  async executeQeury(body: QueryReuqestBody): Promise<unknown> {
    if (!this.#instance) {
      return null;
    }

    const job = await this.#instance.add(body);

    return job.finished();
  }
}

export default AppoloService;
