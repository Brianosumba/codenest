const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      default: "#4f46e5",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    snippetIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Snippet",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Folder", folderSchema);
