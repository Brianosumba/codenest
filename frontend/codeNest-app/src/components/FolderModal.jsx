import { useEffect, useState } from "react";
import "../styles/folderModal.css";

const FolderModal = ({
  isOpen,
  onClose,
  onCreate,
  folderToEdit,
  onUpdate,
  onDelete,
}) => {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#4f46e5");

  useEffect(() => {
    if (folderToEdit) {
      setName(folderToEdit.name);
      setColor(folderToEdit.color || "#4f46e5");
    } else {
      setName("");
      setColor("#4f46e5");
    }
  }, [folderToEdit]);

  const handleSubmit = () => {
    if (!name.trim()) {
      alert("Folder name is required");
      return;
    }

    const folderData = { name: name.trim(), color };

    if (folderToEdit) {
      onUpdate(folderToEdit._id, folderData);
    } else {
      onCreate(folderData);
    }

    onClose();
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete "${folderToEdit.name}"? This cannot be undone.`
      )
    ) {
      onDelete(folderToEdit._id);

      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{folderToEdit ? "Edit Folder" : "Create New Folder"}</h3>
        <input
          type="text"
          placeholder="Folder name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>
          Color:
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </label>

        <div className="modal-actions">
          <button onClick={onClose} className="cancel-btn">
            Cancel
          </button>

          <button onClick={handleSubmit} className="create-btn">
            {folderToEdit ? "Update" : "Create"}
          </button>

          {folderToEdit && (
            <button onClick={handleDelete} className="delete-btn">
              Delete Folder
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FolderModal;
