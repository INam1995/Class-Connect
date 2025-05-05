const FolderGrid = ({ title, folders, color, onFolderClick, onDelete, deleteLabel = "Delete" }) => (
  <div>
    <h2 className={`text-2xl font-bold ${color} mb-4`}>{title}</h2>
    {folders.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {folders.map((folder) => (
          <div key={folder._id} className="flex flex-col items-center bg-white shadow-lg rounded-lg p-4 transition duration-300 hover:scale-105">
            <button
              onDoubleClick={() => onFolderClick(folder._id)} // ✅ Fix: Trigger double-click correctly
              className="w-20 h-20 flex items-center justify-center text-xl bg-opacity-30 rounded-lg shadow-md"
            >
              📂
            </button>
            <h3 className="text-lg font-semibold text-center mt-2">{folder.name}</h3>
            <p className="text-gray-500 text-sm text-center">{folder.subject}</p>
            <button
              onClick={() => onDelete(folder._id)}
              className="bg-red-500 text-white px-2 py-1 rounded-md text-sm mt-2 hover:bg-red-600"
            >
              {deleteLabel}
            </button>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-gray-500 text-center">No folders available.</p>
    )}
  </div>
);

export default FolderGrid;
