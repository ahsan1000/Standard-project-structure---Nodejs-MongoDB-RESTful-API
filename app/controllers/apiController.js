//apicontroller  with upload file by year and month

const { v4: uuidv4 } = require("uuid");
const Document = require("../models/document");
require("dotenv").config();

// Update these lines in your controllers
const serverURL = "http://localhost";

// Endpoint controller for Status
exports.Status = async (req, res) => {
  try {
    res.json({ message: "API is running correctly!" });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
// Endpoint controller for file create
exports.createDocument = (req, res) => {
  res.sendFile({});
};
// Endpoint controller for searching documents
exports.searchDocuments = async (req, res) => {
  try {
    res.json({});
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
