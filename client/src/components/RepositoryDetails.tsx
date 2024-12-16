import { FC } from "react";
import { useQuery } from "@apollo/client";

import { GET_REPOSITORY_DETAILS } from "../queries";
import { RepositoryDetails } from "../types";

interface Props {
  owner: string;
  repository: string;
}

const RepositoryDetailsComponent: FC<Props> = ({ owner, repository }) => {
  const { data, loading } = useQuery<{ repositoryDetails: RepositoryDetails }>(
    GET_REPOSITORY_DETAILS,
    {
      variables: {
        owner,
        repository,
      },
    }
  );

  const details = data?.repositoryDetails;

  if (loading) {
    return <p style={{ margin: 0 }}>Details are loading...</p>;
  }

  if (!details) {
    return <h3>Oooops. We didn't find anything. Try later :)</h3>;
  }

  return (
    <div
      style={{ border: "1px solid black", padding: "5px", borderRadius: "4px" }}
    >
      <p style={{ margin: 0, marginBottom: "2px" }}>Name: {details.name}</p>
      <p style={{ margin: 0, marginBottom: "2px" }}>Size: {details.size}</p>
      <p style={{ margin: 0, marginBottom: "2px" }}>Owner: {details.owner}</p>
      <p style={{ margin: 0, marginBottom: "2px" }}>
        Visibility: {details.visibility}
      </p>
      <p style={{ margin: 0, marginBottom: "2px" }}>
        Number of files: {details.numberOfFiles}
      </p>
      {details.ymlFileContent && (
        <p style={{ margin: 0, marginBottom: "2px" }}>
          YML file content: {details.ymlFileContent}
        </p>
      )}
      {!!details.webhooks.length && (
        <div>
          Webhooks:
          <ul style={{ margin: 0, paddingInlineStart: "20px" }}>
            {details.webhooks.map((item, index) => (
              <li key={index}>
                <p style={{ margin: 0, marginBottom: "2px" }}>
                  Name: {item.name}
                </p>
                <p style={{ margin: 0, marginBottom: "2px" }}>
                  Created At: {item.createdAt}
                </p>
                <p style={{ margin: 0, marginBottom: "2px" }}>
                  Updated At: {item.updatedAt}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default RepositoryDetailsComponent;
