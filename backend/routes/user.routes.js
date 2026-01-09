const express = require("express");
const { upload } = require("../middlewares/multer.middlewares.js");
const {
  userSignup,
  userLogin,
  getUser,
  userUpdate,
  profileImageHandler,
  changePasswordHandler,
  getHostelsHandler,
  getWardensHandler,
  getStudentsHandler,
  removeUserHandler,
} = require("../controllers/user.controllers.js");

const router = express.Router();

router.route("/signup").post(userSignup);

router.route("/login").post(userLogin);

router.get("/getUser", getUser);

router.put("/update", userUpdate);

router.post(
  "/profileImage",
  upload.single("profileImage"),
  profileImageHandler
);

router.post("/changepassword", changePasswordHandler);

router.get("/getHostels", getHostelsHandler);

router.get("/:hostel/getstudents", getStudentsHandler);

router.get("/:hostel/getwardens", getWardensHandler);

router.delete("/remove/:userID", removeUserHandler);
module.exports = router;
