const express = require("express");
const router = express.Router();
const {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  editUser,
  verifyUser,
  signInUser,
} = require("../controller/userController");
const { upload } = require("../utils/multer");

router.route("/users").get(getUsers);
router.route("/user/signup").post(upload, createUser);
router.route("/user/:id").get(getUser).delete(deleteUser).patch(editUser);
router.route("/user/:id/token").get(verifyUser);
router.route("/signin").post(signInUser);

module.exports = router;
