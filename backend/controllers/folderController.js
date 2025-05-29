const Folder = require("../models/Folder");
const Snippet = require("../models/Snippet");

// Get all folders for logged-in user
exports.getFolders = async (req, res) => {
  try {
    const folders = await Folder.find({ userId: req.user.id }).sort("name");
    res.json(folders);
  } catch (err) {
    console.error(" Failed to fetch folders:", err);
    res.status(500).json({ message: "Failed to fetch folders" });
  }
};

// Create a new folder
exports.createFolder = async (req, res) => {
  const { name, color } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Folder name is required" });
  }

  try {
    // Check for duplicate name for this user
    const existing = await Folder.findOne({
      name: name.trim(),
      userId: req.user.id,
    });

    if (existing) {
      return res.status(409).json({ message: "Folder name already exists" });
    }

    const folder = new Folder({
      name: name.trim(),
      color: color || "#4f46e5",
      userId: req.user.id,
    });

    await folder.save();
    res.status(201).json(folder);
  } catch (err) {
    console.error(" Failed to create folder:", err);
    res.status(500).json({ message: "Failed to create folder" });
  }
};

// Update a folder (name or color)
exports.updateFolder = async (req, res) => {
  const { name, color } = req.body;

  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      userId: req.user.id, // ✅ fixad här
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Kontrollera om nytt namn redan används av en annan mapp
    if (name) {
      const existing = await Folder.findOne({
        name: name.trim(),
        userId: req.user.id,
        _id: { $ne: req.params.id },
      });

      if (existing) {
        return res.status(409).json({ message: "Folder name already exists" });
      }

      folder.name = name.trim();
    }

    if (color) folder.color = color;

    await folder.save();
    res.json(folder);
  } catch (err) {
    console.error("Update folder error:", err);
    res.status(500).json({ message: "Failed to update folder" });
  }
};

// Delete a folder
exports.deleteFolder = async (req, res) => {
  try {
    const deleted = await Folder.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id, // ✅ Kontrollera att det är litet "i" här
    });

    if (!deleted) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json({ message: "Folder deleted successfully" });
  } catch (err) {
    console.error("Delete folder error:", err); // 🐛 Lägg till mer info
    res.status(500).json({ message: "Failed to delete folder" });
  }
};

// Get a single folder + its snippets
exports.getFolderWithSnippets = async (req, res) => {
  try {
    const folder = await Folder.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }
    // Hämta alla snippets som finns i folderns snippetIds-array
    const snippets = await Snippet.find({
      _id: { $in: folder.snippetIds },
    });
    res.json({ folder, snippets });
  } catch (err) {
    console.error("Error fetching folder with snippets:", err);
    res.status(500).json({ message: "failed to load folder details" });
  }
};

//Add snippets to folder
exports.addSnippetToFolder = async (req, res) => {
  const folderId = req.params.id;
  const { snippetId } = req.body;

  if (!snippetId) {
    return res.status(400).json({ message: "snippetId is required" });
  }

  try {
    // Kontrollera att foldern tillhör användaren
    const folder = await Folder.findOne({ _id: folderId, userId: req.user.id });

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    // Kontrollera att snippet inte redan finns
    if (folder.snippetIds.includes(snippetId)) {
      return res.status(409).json({ message: "Snippet already in folder" });
    }

    folder.snippetIds.push(snippetId);
    await folder.save();

    res.status(200).json({ message: "Snippet added to folder", folder });
  } catch (err) {
    console.error("Error adding snippet to folder:", err);
    res.status(500).json({ message: "Failed to add snippet to folder" });
  }
};

//remove Snippets from folder
exports.removeSnippetFromFolder = async (req, res) => {
  try {
    const { snippetId } = req.body;

    const folder = await Folder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $pull: { snippetIds: snippetId } },
      { new: true }
    );

    if (!folder) {
      return res.status(404).json({ message: "Folder not found" });
    }

    res.json({ message: "Snippet removed", folder });
  } catch (err) {
    console.error("Error removing snippet from folder:", err);
    res.status(500).json({ message: "Server error" });
  }
};
