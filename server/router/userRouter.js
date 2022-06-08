const express = require("express");
const {
  getUsers,
  createUser,
  getUser,
  deleteUser,
  editUser,
  verifyUser,
} = require("../controller/userController");
const router = express.Router();
const { upload } = require("../utils/multer");

router.route("/users").get(getUsers);
router.route("user/signup").post(upload, createUser);
router.route("user/:id").get(getUser).delete(deleteUser).patch(editUser);
router.route("user/:id/token").get(verifyUser);

module.exports = router;
