function App() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 p-4">
        <h1 className="text-xl font-bold mb-6">AI Code Review</h1>
        <nav className="space-y-2">
          <div className="cursor-pointer hover:text-white">Repo List</div>
          <div className="cursor-pointer hover:text-white">Diff Viewer</div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <h2 className="text-2xl font-semibold mb-4">Welcome 👋</h2>
        <p className="text-gray-400">
          Select a repository to start reviewing code.
        </p>
      </main>
    </div>
  )
}

export default App
