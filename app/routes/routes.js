const express = require("express");
const router = express.Router();
const apiController = require("../controllers/apiController");

// Multer configuration

// Define routes
router.post("/createDocument", apiController.createDocument);
router.get("/searchDocuments", apiController.searchDocuments);
router.get("/", apiController.Status);

module.exports = router;
