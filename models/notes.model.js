const mongoose = require("mongoose");

const NotesSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model.notes || mongoose.model("notes", NotesSchema);
