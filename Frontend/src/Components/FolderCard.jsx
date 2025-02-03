import React from "react";

const FolderCard = ({ folder, onDoubleClick }) => {
  return (
    <div
      className="border p-4 rounded-md shadow-md cursor-pointer"
      onDoubleClick={() => onDoubleClick(folder._id)} // Trigger onDoubleClick with folder._id
    >
      <h3 className="font-bold text-lg">{folder.name}</h3>
      <p>{folder.subject}</p>
    </div>
  );
};

export default FolderCard;
