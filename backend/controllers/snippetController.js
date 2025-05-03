const Snippet = require("../models/Snippet");

//CREATE NEW SNIPPETS
exports.createSnippet = async (req, res) => {
  const { title, code, description, language, category, tags, isFavorite } =
    req.body;

  const cleanTags = Array.isArray(tags)
    ? tags.filter((tag) => tag && tag.trim() !== "")
    : [];

  try {
    const newSnippet = new Snippet({
      title,
      code,
      description,
      language,
      category,
      tags: cleanTags,
      isFavorite,
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
