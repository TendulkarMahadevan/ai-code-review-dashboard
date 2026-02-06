import { useReviewStore } from "../../store/reviewStore";
import { useFiles } from "../../hooks/useFiles";

const FileTree = () => {
  const repoId = useReviewStore((s) => s.selectedRepoId);
  const { data, isLoading } = useFiles(repoId);

  if (!repoId) return <div>Select a repo</div>;
  if (isLoading) return <div>Loading files...</div>;

  return (
    <ul>
      {data?.map((file) => (
        <li key={file} className="pl-2 text-sm">
          {file}
        </li>
      ))}
    </ul>
  );
};

export default FileTree;
