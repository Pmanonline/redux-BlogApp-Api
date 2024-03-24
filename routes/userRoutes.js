import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import * as userController from "../controllers/userController.js";
import path from "path";
import multer from "multer";
const router = express.Router();
const app = express();
// *************************************?
// configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "../frontend/public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

const checkFileType = function (file, cb) {
  //Allowed file extensions
  const fileTypes = /jpeg|jpg|png|gif|svg/;

  //check extension names
  const extName = fileTypes.test(path.extname(file.originalname).toLowerCase());

  const mimeType = fileTypes.test(file.mimetype);

  if (mimeType && extName) {
    return cb(null, true);
  } else {
    cb("Error: You can Only Upload Images!!");
  }
};
app.use(express.static("../frontend/public/upload"));
// *************************************?

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.route("/profile").get(protect, userController.getUserProfile);
// router.route("/getposts").get(userController.getposts);
router.route("/getposts/:category?").get(userController.getposts);
router.route("/getPostById/:uuid").get(userController.getPostById);
router.post("/createPost", upload.single("image"), userController.createPost);

export default router;
