import { request } from "@octokit/request";
import { RequestInterface } from "@octokit/types";
import { GraphQLError } from "graphql";

import { checkIsFile, checkIsYMLFile } from "./utils.js";
import {
  CommonRepositoryData,
  IGithubDatasource,
  RepositoryDetails,
  RepositoryFile,
  RepositoryWebhook,
} from "./types.js";

export class GithubDatasource implements IGithubDatasource {
  #api: RequestInterface;

  constructor(token: string = "") {
    if (!token) {
      throw new GraphQLError("Github PAT is missing!", {
        extensions: { code: "CRITICAL_ERROR" },
      });
    }

    this.#api = request.defaults({
      headers: {
        authorization: `Bearer ${token}`,
        "user-agent": "Kernelics-Task",
      },
    });
  }

  async #getRepositoryData(
    owner: string,
    repo: string
  ): Promise<Omit<
    RepositoryDetails,
    "webhooks" | "numberOfFiles" | "ymlFileContent"
  > | null> {
    try {
      const { data: repsitoryData } = await this.#api(
        `GET /repos/{owner}/{repo}`,
        { owner, repo }
      );

      return {
        name: repsitoryData.name,
        size: repsitoryData.size,
        owner,
        visibility: repsitoryData.visibility || "public",
      };
    } catch (error) {
      return null;
    }
  }

  async #getRepositoryFiles(
    owner: string,
    repo: string
  ): Promise<RepositoryFile[]> {
    try {
      const { data: commits } = await this.#api(
        "GET /repos/{owner}/{repo}/commits",
        { owner, repo }
      );

      const lastCommit = commits.shift();

      if (!lastCommit) {
        return [];
      }

      const { data: filesTree } = await this.#api(
        "GET /repos/{owner}/{repo}/git/trees/{tree_sha}",
        { owner, repo, tree_sha: lastCommit.sha, recursive: "true" }
      );

      return filesTree.tree.filter(checkIsFile);
    } catch (e) {
      return [];
    }
  }

  async #getRepositoryWebhooks(
    owner: string,
    repo: string
  ): Promise<RepositoryWebhook[]> {
    try {
      const { data: hooks } = await this.#api(
        "GET /repos/{owner}/{repo}/hooks",
        {
          owner,
          repo,
        }
      );

      return hooks.reduce<RepositoryWebhook[]>(
        (acc, hook) =>
          hook.active
            ? [
                ...acc,
                {
                  id: hook.id,
                  name: hook.name,
                  events: hook.events,
                  createdAt: hook.created_at,
                  updatedAt: hook.updated_at,
                },
              ]
            : acc,
        []
      );
    } catch (error) {
      return [];
    }
  }

  async #getYMLFileContent(
    files: RepositoryFile[],
    owner: string,
    repo: string
  ): Promise<string> {
    const ymlFileInfo = files.find(checkIsYMLFile);

    if (!ymlFileInfo || !ymlFileInfo.sha) {
      return "";
    }

    try {
      const { data } = await this.#api(
        "GET /repos/{owner}/{repo}/git/blobs/{file_sha}",
        { owner, repo, file_sha: ymlFileInfo.sha }
      );

      return data.content;
    } catch (error) {
      return "";
    }
  }

  async #getUserRepositories(): Promise<CommonRepositoryData[]> {
    try {
      const { data: repositories } = await this.#api("GET /user/repos");

      return repositories.map((item) => ({
        name: item.name,
        size: item.size,
        owner: item.owner.login,
      }));
    } catch (error) {
      return [];
    }
  }

  async #getOrganizationsRepositories(): Promise<CommonRepositoryData[]> {
    try {
      const { data: organizations } = await this.#api("GET /user/orgs");
      const promises = organizations.map((item) =>
        this.#api("GET /orgs/{org}/repos", { org: item.login })
      );
      const response = await Promise.all(promises);
      const repositories = response.map((item) => item.data).flat();

      return repositories.map((item) => ({
        name: item.name,
        size: item.size || 0,
        owner: item.owner.login,
      }));
    } catch (error) {
      return [];
    }
  }

  async getRepositories(): Promise<CommonRepositoryData[]> {
    const userRepositories = await this.#getUserRepositories();
    const organizationRepositories = await this.#getOrganizationsRepositories();

    return [...userRepositories, ...organizationRepositories];
  }

  async getRepositoryDetails(
    owner: string,
    repository: string
  ): Promise<RepositoryDetails | null> {
    const commonRepositoryData = await this.#getRepositoryData(
      owner,
      repository
    );

    if (!commonRepositoryData) {
      return null;
    }

    const details: RepositoryDetails = {
      ...commonRepositoryData,
      webhooks: [],
      numberOfFiles: 0,
      ymlFileContent: "",
    };

    if (!details.size) {
      return details;
    }

    const [files, webhooks] = await Promise.all([
      this.#getRepositoryFiles(owner, repository),
      this.#getRepositoryWebhooks(owner, repository),
    ]);

    details.webhooks = webhooks;
    details.numberOfFiles = files.length;

    details.ymlFileContent = await this.#getYMLFileContent(
      files,
      owner,
      repository
    );

    return details;
  }
}
