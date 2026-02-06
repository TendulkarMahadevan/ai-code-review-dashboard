import { useQuery } from "@tanstack/react-query";
import files from "../mocks/files.json";
import { fetchWithDelay } from "../services/api";

export const useFiles = (repoId: string | null) =>
  useQuery<string[]>({
    queryKey: ["files", repoId],
    enabled: !!repoId,
    queryFn: () => fetchWithDelay(files[repoId as keyof typeof files]),
  });
