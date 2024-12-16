import { ChangeEvent, useState } from "react";
import { useQuery } from "@apollo/client";

import { GET_REPOSITORIES } from "../queries";
import RepositoryDetailsComponent from "./RepositoryDetails";
import { CommonRepositoryData } from "../types";

const Repositories = () => {
  const [filter, setFilter] = useState("");
  const [selectedRepository, setSelectedRepository] = useState<{
    owner: string;
    repository: string;
  } | null>(null);
  const { data, loading } = useQuery<{
    repositories: CommonRepositoryData[];
  }>(GET_REPOSITORIES, {
    variables: {
      filter,
    },
  });

  const repositories = data?.repositories || [];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
    setSelectedRepository(null);
  };

  const handleSelectRepository = (owner: string, repository: string) => {
    setSelectedRepository({ owner, repository });
  };

  return (
    <div>
      <input onChange={handleChange} />
      {loading && <div>Loading repositories...</div>}
      <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
        <div
          style={{
            flex: "0 0 50%",
            display: "flex",
            flexDirection: "column",
            gap: "5px",
          }}
        >
          {repositories.map((item, index) => (
            <div
              key={index}
              style={{
                border: "1px solid black",
                borderRadius: "10px",
                padding: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleSelectRepository(item.owner, item.name)}
            >
              <p style={{ margin: 0, marginBottom: "2px" }}>{item.name}</p>
              <span style={{ color: "gray" }}>
                Size: {item.size}; Owner: {item.owner}
              </span>
            </div>
          ))}
        </div>
        <div style={{ flex: "1 1 auto" }}>
          {selectedRepository && (
            <RepositoryDetailsComponent
              owner={selectedRepository.owner}
              repository={selectedRepository.repository}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Repositories;
