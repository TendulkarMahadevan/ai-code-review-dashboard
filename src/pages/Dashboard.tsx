import RepoList from "../components/RepoList/RepoList";
import FileTree from "../components/FileTree/FileTree";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r p-4 space-y-4">
        <RepoList />
        <FileTree />
      </aside>
      <main className="flex-1 p-4">Diff Viewer (next)</main>
    </div>
  );
};

export default Dashboard;
