import { CommonRepositoryData, RepositoryFile } from "./types.js";

const BLOB_FILE_TYPE = "blob";

export const checkIsYMLFile = (file: RepositoryFile): boolean =>
  !!file.path?.match(/(.yml)$/g);

export const checkIsFile = (file: RepositoryFile): boolean =>
  file.type === BLOB_FILE_TYPE;
