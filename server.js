import path from "path";
import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import multer from "multer";
import colors from "colors";
import fs from "fs";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import { getposts } from "./controllers/userController.js";
import { getPostById } from "./controllers/userController.js";
import Post from "./models/postModel.js";

// Load environment variables from .env file
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// CORS
app.use(
  cors({
    origin: "*",
  })
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  next();
});
app.options("*", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000"); // Replace with your client's domain
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.sendStatus(200);
});

app.use(express.json());
// storage

// Handle image uploads
app.use(express.static("./frontend/public/upload"));

// // // configure env file in production
if (process.env.NODE_ENV === undefined) {
  dotenv.config({ path: "../.env" });
}

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

// * Load Env
dotenv.config({ path: "./config.env" });

// //* Log route actions
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// API routes
app.use("/api/user", userRoutes);
app.get("/api/user/getposts", getposts);
// app.get("/api/user/getPostById/:uuid", getPostById);

// Middleware
app.use(notFound);
app.use(errorHandler);

// GET posts by category

// Example route to fetch posts by category
app.get("/posts/:category", async (req, res) => {
  const category = req.params.category;

  try {
    // Query the database to find posts with the specified category
    const posts = await Post.find({ cat: category });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// CATEGORIES SEARCH

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
