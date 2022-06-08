const userModel = require("../model/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinary");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({});

const getUsers = async (req, res) => {
  try {
    const userGet = await userModel.find();
    res.status(200).json({
      message: "Goten Sucessfully",
      data: userGet,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
const getUser = async (req, res) => {
  try {
    const userGet = await userModel.findById(req.params.id);
    res.status(200).json({
      message: `Goten ${req.params.id}`,
      data: userGet,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const userDelete = await userModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      message: "suces",
      data: userDelete,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
const editUser = async (req, res) => {
  try {
    const { fullName, userName } = req.body;
    const user = await userModel.findById(req.params.id);

    if (user) {
      await cloudinary.uploader.destroy(user.avatarID);
      const image = await cloudinary.uploader.upload(req.file.path);
      const user = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          fullName,
          userName,
          avatar: image.secure_url,
          avatarID: image.public_id,
        },
        { new: true }
      );

      res.status(200).json({
        message: "Edited",
        data: user,
      });
    } else {
      res.status(404).json({
        message: "Failed to edit",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    const { fullName, userName, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const image = await cloudinary.uploader.upload(req.file.path);

    const getToken = crypto.randomBytes(32).toString("hex");
    const token = jwt.sign({ getToken }, "thiSIStheBestWeEk", {
      expiresIn: "20m",
    });

    const user = await userModel.create({
      fullName,
      userName,
      email,
      password: hashed,
      avatar: image.secure_url,
      avatarID: image.public_id,
      verifiedToken: token,
    });

    const testURL = "http://localhost:3000/";
    const mainURL = "";

    const mailOption = {
      from: "no-reply@gmail.com",
      to: email,
      subject: "Account Verification",
      html: `<h2> Hello ${fullName}, welcome to <strong> Social Build </strong>this is to verify your Account please   <a href="${testURL}/api/user/${user._id}/${token}">Click this Link</a> to Continue</h2>`,
    };

    transport.sendMail(mailOption, (err, info) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Mail Sent", info.response);
      }
    });

    res.status(200).json({ massage: "Chenk your Mail to continue..." });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const verifyUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);

    if (user) {
      if (user.verifiedToken !== "") {
        await userModel.findByIdAndUpdate(
          req.params.id,
          {
            isVerified: true,
            verifiedToken: "",
          },
          { new: true }
        );
        res.status(200).json({ message: "Your Account is now Active" });
      } else {
        res.status(404).json({
          message: "Unable to verify",
        });
      }
    } else {
      res.status(404).json({
        message: "User not Found",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const signInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (user) {
      const check = await bcrypt.compare(password, user.password);
      if (check) {
        if (user.isVerified && user.verifiedToken === "") {
          const token = jwt.sign(
            {
              _id: user._id,
              isVerified: user.isVerified,
            },
            "thiSIStheBestWeEk",
            { expiresIn: "20m" }
          );

          const { password, ...info } = user._doc;

          res.status(200).json({
            message: `Welcome ${user.fullName}`,
            data: { token, ...info },
          });
        } else {
          const getToken = crypto.randomBytes(32).toString("hex");
          const token = jwt.sign({ getToken }, "thiSIStheBestWeEk", {
            expiresIn: "20m",
          });

          const testURL = "http://localhost:3000/";
          const mainURL = "";

          const mailOption = {
            from: "no-reply@gmail.com",
            to: email,
            subject: "Account Verification",
            html: `<h2> Hello ${user.fullName}, welcome to <strong> Social Build </strong>this is to verify your Account please   <a href="${testURL}/api/user/${user._id}/${token}">Click this Link</a> to Continue</h2>`,
          };

          transport.sendMail(mailOption, (err, info) => {
            if (err) {
              console.log(err.message);
            } else {
              console.log("Mail Sent", info.response);
            }
          });

          res.status(200).json({ massage: "Chenk your Mail to continue..." });
        }
      } else {
        res.status(404).json({
          message: "Password Not Correct",
        });
      }
    } else {
      res.status(404).json({
        message: "User Dose Not exist",
      });
    }
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// const editUser = async(req, res) => {
//     try {
//         const {fullName}
//     } catch (error) {
//         res.status(404).json({
//             message: error.message
//         })
//     }
// }

module.exports = {
  getUser,
  getUsers,
  deleteUser,
  editUser,
  createUser,
  verifyUser,
};
