const express = require("express");
const cors = require("cors");
const apiRoutes = require("./app/routes/routes");
const connectDB = require("./app/common/helper");

const app = express();

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

// Connect to the database
connectDB();

// Using routes
app.use("/api", apiRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

// Starting the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
