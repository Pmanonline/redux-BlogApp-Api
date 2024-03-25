// database connection file to MongoDB
import { mongoose } from "mongoose";
const MONGO_URI =
  "mongodb+srv://firstCRUD:w3schools.com@crud.zgveazn.mongodb.net/?retryWrites=true&w=majority";
// "mongodb://127.0.0.1:27017/myDatabase";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    // Set 'strictQuery' to 'false' to prepare for Mongoose 7

    mongoose.set("strictQuery", false);
    console.log(`mongodb is connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.underline.bold);
    process.exit(1);
  }
};

export default connectDB;
// import mongoose from "mongoose";
// import colors from "colors"; // Assuming you have the 'colors' package installed

// const connectDB = async () => {
//   try {
//     console.log("MongoDB URI:", process.env.MONGO_URI); // Add this line
//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       useUnifiedTopology: true,
//       useNewUrlParser: true,
//     });
//     console.log(`MongoDB connected: ${conn.connection.host}`.cyan.underline);
//   } catch (error) {
//     console.error(`Error: ${error.message}`.red.bold);
//     process.exit(1);
//   }
// };

// export default connectDB;
