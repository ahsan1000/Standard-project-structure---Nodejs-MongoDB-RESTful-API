const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dbConfig = require("./app/config/db.config");
const app = express();
const Document = require("./app/models/document");

// Middleware setup
app.use(
  cors({
    methods: "GET,POST,PATCH,DELETE,OPTIONS",
    optionsSuccessStatus: 200,
    origin: ["http://localhost:3000", "https://localhost:3000"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const dbUrl = dbConfig.url;
mongoose
  .connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to the database!"))
  .catch((err) => {
    console.error("Cannot connect to the database!", err);
    process.exit(1);
  });

// Importing routes
const apiRoutes = require("./app/routes/routes");

// Using routes
app.use("/api", apiRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

// Starting the server
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
