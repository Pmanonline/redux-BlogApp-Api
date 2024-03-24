// import jwt from "jsonwebtoken";
//  import jwt from "jsonwebtoken";

// // Retrieve the secret key from the environment variable
// const JWT_SECRET = process.env.JWT_SECRET || "your-default-secret-key";

// // Generate token that expires in 12 hours
// const generateToken = (id) => {
//   return jwt.sign({ id }, JWT_SECRET, { expiresIn: "12h" });
// };

// export default generateToken;

import jwt from "jsonwebtoken";

// Define the secret key
const JWT_SECRET = "your-secret-key"; // Replace with your actual secret key

// Generate token that expires in 12 hours
const generateToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "12h" });
};

export default generateToken;
