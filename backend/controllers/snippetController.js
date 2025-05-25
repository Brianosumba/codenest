const Snippet = require("../models/Snippet");

//CREATE NEW SNIPPETS
exports.createSnippet = async (req, res) => {
  const {
    title,
    code,
    description,
    language,
    framework,
    category,
    tags,
    isFavorite,
    type,
  } = req.body;

  const cleanTags = Array.isArray(tags)
    ? tags.filter((tag) => tag && tag.trim() !== "")
    : [];

  //Validera att språk finns
  if (!language || language.trim() === "") {
    return res.status(400).json({
      message: "Language is required.",
    });
  }

  // Validera att framework är med om typen är "framework"
  if (type === "framework" && (!framework || framework.trim() === "")) {
    return res.status(400).json({
      message: "Framework is required for framework snippets.",
    });
  }

  try {
    const newSnippet = new Snippet({
      title,
      code,
      description,
      language,
      framework,
      category,
      tags: cleanTags,
      isFavorite,
      type,
      userId: req.user.id,
    });

    await newSnippet.save();

    res
      .status(201)
      .json({ message: "Snippet created successfully", snippet: newSnippet });
  } catch (err) {
    console.error("Error creating snippet", err);
    res.status(500).json({ message: "Server error creating snippet" });
  }
};

// GET ALL SNIPPETS FOR USER
exports.getUserSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(snippets);
  } catch (err) {
    console.error("Error fetching snippets", err);
    res.status(500).json({ message: "Server error fetching snippets" });
  }
};

//GET SNIPPET BY ID
exports.getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!Snippet || snippet.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    res.status(200).json(snippet);
  } catch (err) {
    console.error("Error fetching snippet", err);
    res.status(500).json({ message: "Server error fetching snippet" });
  }
};

//TOGGLE FAVORITE
exports.toggleFavorite = async (req, res) => {
  try {
    const snippet = await Snippet.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    snippet.isFavorite = !snippet.isFavorite;
    await snippet.save();

    res.json({
      message: "Favorite status updated",
      isFavorite: snippet.isFavorite,
    });
  } catch (err) {
    console.error("Toggle favorite error", err);
    res.status(500).json({ message: "Server error" });
  }
};

//EDIT SNIPPET
exports.updateSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );

    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    res.status(200).json({
      message: "Snippet updated successfully",
      snippet,
    });
  } catch (err) {
    console.error("Error updating snippet", err);
    res.status(500).json({ message: "Server error updating snippet" });
  }
};

//DELETE SNIPPET
exports.deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }
    res.json({ message: "Snippet deleted successfully" });
  } catch (err) {
    console.error("Error deleting snippet", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Toggles a snippet's sharing status between private and public.
exports.shareSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);

    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    //Ensure only the owner can toggle between private or public
    if (snippet.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    snippet.isShared = req.body.isShared;
    await snippet.save();

    res.json({ isShared: snippet.isShared });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update sharing status" });
  }
};

// GET SHARED SNIPPETS
exports.getSharedSnippets = async (req, res) => {
  try {
    const sharedSnippets = await Snippet.find({ isShared: true })
      .sort({
        createdAt: -1,
      })
      .populate("userId", "username role");
    res.json(sharedSnippets);
  } catch (err) {
    console.error("Error in getSharedSnippets:", err);
    res.status(500).json({ message: "Failed to load shared snippets" });
  }
};
