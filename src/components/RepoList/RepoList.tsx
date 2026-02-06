import { useRepos } from "../../hooks/useRepos";
import { useReviewStore } from "../../store/reviewStore";

const RepoList = () => {
  const { data, isLoading } = useRepos();
  const setRepo = useReviewStore((s) => s.setSelectedRepoId);

  if (isLoading) return <div>Loading repos...</div>;

  return (
    <ul>
      {data?.map((repo) => (
        <li
          key={repo.id}
          className="cursor-pointer p-2 hover:bg-gray-100"
          onClick={() => setRepo(repo.id)}
        >
          {repo.name}
        </li>
      ))}
    </ul>
  );
};

export default RepoList;
