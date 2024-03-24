import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Ensure that the title is required
  },
  value: {
    type: String,
    required: true,
  },
  cat: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  authorName: {
    type: String,
    required: true,
  },
  authorRole: {
    type: String,
    required: true,
  },
  uuid: {
    type: String, // Assuming uid is a string, adjust the type as needed
  },
  userId: {
    type: String, // Assuming userId is a string, adjust the type as needed
  },
  image: {
    type: String, // Store the file URL as a string
  },
});

const Post = mongoose.model("Post", postSchema);

export default Post;
