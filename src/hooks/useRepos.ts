import { useQuery } from "@tanstack/react-query";
import repos from "../mocks/repos.json";
import { fetchWithDelay } from "../services/api";
import type { Repo } from "../types";

export const useRepos = () =>
  useQuery<Repo[]>({
    queryKey: ["repos"],
    queryFn: () => fetchWithDelay(repos),
  });
