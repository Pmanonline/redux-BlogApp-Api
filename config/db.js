import { mongoose } from "mongoose";
const MONGO_URI =
  "mongodb+srv://firstCRUD:w3schools.com@crud.zgveazn.mongodb.net/";

// "mongodb://127.0.0.1:27017/myDatabase";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    mongoose.set("strictQuery", true);
    console.log(`mongodb is connected: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error: ${error.message}`.underline.bold);
    process.exit(1);
  }
};

export default connectDB;

// "mongodb+srv://firstCRUD:w3schools.com@crud.zgveazn.mongodb.net/?retryWrites=true&w=majority";
