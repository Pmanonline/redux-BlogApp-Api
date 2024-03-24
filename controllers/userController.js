import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Post from "../models/postModel.js"; // Import your Post model
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

import mongoose from "mongoose";

import generateToken from "../utils/generateToken.js";
import express from "express";
import { Router } from "express";

const registerUser = asyncHandler(async (req, res) => {
  const { firstName, email, password } = req.body;

  // check if email exists in db
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(404);
    throw new Error("User already exists");
  }

  // create new user document in db
  const user = await User.create({ firstName, email, password });

  if (user) {
    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // check if user email exists in db
  const user = await User.findOne({ email });

  // return user obj if their password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      firstName: user.firstName,
      email: user.email,
      userToken: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  // req.user was set in authMiddleware.js
  const user = await User.findById(req.user._id);

  if (user) {
    res.json({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// const createPost = asyncHandler(async (req, res) => {
//   const { title, desc, cat, date, authorName, authorRole } = req.body;
//   const uuid = uuidv4();

//   let file = ""; // Initialize file as an empty string

//   if (req.file) {
//     // If a file was uploaded, set the file URL to the path of the uploaded file
//     file = req.file.path;
//   }

//   const newPost = await Post.create({
//     title,
//     desc,
//     cat,
//     date,
//     uuid,
//     authorName,
//     authorRole,
//     file, // Save the file URL in the 'file' field
//   });

//   if (newPost) {
//     res.status(201).json({
//       title: newPost.title,
//       desc: newPost.desc,
//       cat: newPost.cat,
//       date: newPost.cat,
//       authorname: newPost.authorName,
//       authorrole: newPost.authorRole,
//       file: newPost.file,
//       uuid: newPost.uuid,
//     });
//   } else {
//     res.status(400);
//     throw new Error("Invalid user data");
//   }
// });

const createPost = async (req, res) => {
  try {
    const { title, authorName, authorRole, cat, value } = req.body;
    const uuid = uuid.v4();

    // Get the original filename from the uploaded file
    const originalFilename = req.file.originalname;

    // Save the data to MongoDB with only the original filename
    const user = new Post({
      title,
      authorName,
      authorRole,
      cat,
      value,
      uuid,
      image: originalFilename,
    });
    await user.save();

    res.json({ message: "Post/Upload successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// const getposts = async (req, res) => {
//   try {
//     // Fetch all posts from the database
//     const posts = await Post.find();

//     // Return the array of posts in the response
//     res.status(200).json(posts);
//   } catch (error) {
//     res.status(404);
//     res.status(500).json({ message: "Server error" });
//     throw new Error("post not found");
//   }
// };
const getposts = async (req, res) => {
  try {
    // Get the search query parameter from the request
    const searchQuery = req.query.search;

    // Define a filter object to pass to the find method
    const filter = {};

    // If a search query is provided, add it to the filter
    if (searchQuery) {
      // Assuming you want to search by the 'title' field
      filter.title = { $regex: new RegExp(searchQuery, "i") };
    }

    // Fetch posts from the database based on the filter
    const posts = await Post.find(filter);

    // Return the array of filtered posts in the response
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Define the route to get a single post by UID
const getPostById = async (req, res) => {
  try {
    const { uuid } = req.params;

    // Check if the uuid parameter is valid
    if (!uuid || !mongoose.Types.ObjectId.isValid(uuid)) {
      return res.status(400).json({ message: "Invalid UUID parameter" });
    }

    const post = await Post.findOne({ uuid: uuid });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const response = {
      title: post.title,
      value: post.value,
      cat: post.cat,
      authorName: post.authorName,
      authorRole: post.authorRole,
      _id: post._id,
      uuid: post.uuid,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @route type: PUT
// @route: /api/posts/update/:uuid
const updatePost = async (req, res) => {
  try {
    const { title, value, cat, authorName, authorRole } = req.body;
    const { uuid } = req.params;

    // Find the post by its UUID
    const existingPost = await Post.findOne({ uuid });

    if (!existingPost) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Update the post properties
    existingPost.title = title;
    existingPost.value = value;
    existingPost.cat = cat;
    existingPost.authorName = authorName;
    existingPost.authorRole = authorRole;

    // Save the updated post
    const updatedPost = await existingPost.save();

    res.status(200).json({
      _id: updatedPost._id,
      title: updatedPost.title,
      value: updatedPost.value,
      cat: updatedPost.cat,
      uuid: updatedPost.uuid,
      authorName: updatedPost.authorName,
      authorRole: updatedPost.authorRole,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export {
  registerUser,
  loginUser,
  getUserProfile,
  createPost,
  getposts, // Add the createPost route
  getPostById,
  // getPosts,
  updatePost,
  // deletePost,
};

// Define the route to get a single post by UID
