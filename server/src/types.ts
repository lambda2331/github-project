export interface RepositoryWebhook {
  id: number | string;
  name: string;
  events: string[];
  createdAt: string;
  updatedAt: string;
}

export interface RepositoryFile {
  path?: string;
  mode?: string;
  type?: string;
  sha?: string;
  size?: number;
  url?: string;
}

export interface CommonRepositoryData {
  size: number;
  name: string;
  owner: string;
}

export interface RepositoryDetails extends CommonRepositoryData {
  visibility: string;
  webhooks: RepositoryWebhook[];
  numberOfFiles: number;
  ymlFileContent: string;
}

export interface IGithubDatasource {
  getRepositories(): Promise<CommonRepositoryData[]>;

  getRepositoryDetails(
    owner: string,
    repository: string
  ): Promise<RepositoryDetails | null>;
}

export interface ContextValue {
  dataSource: {
    githubAPI: IGithubDatasource;
  };
}
