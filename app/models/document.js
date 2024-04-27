const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  Name: String,
  property: String,
  createdDate: Date,
  status: String,
  fileNumber: String,
  fileId: String,
});

module.exports = mongoose.model("Document", documentSchema);
