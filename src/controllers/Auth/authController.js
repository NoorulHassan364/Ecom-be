const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const EmailHelpers = require("../../utils/emails");

class Auth {
  signup = async (req, res) => {
    try {
      const data = await User.create(req.body);

      res.status(201).json({
        status: "success",
        message: "signup successfully!",
        data: data,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  };

  createSendToken = (user, statusCode, res) => {
    const token = this.signToken(user._id);
    user.password = undefined;

    res.status(statusCode).json({
      status: "success",
      token,
      user: user,
    });
  };

  // creating token
  signToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  // user login
  LogIn = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).send("incorrect email or password");
      }
      const user = await User.findOne({ email });
      if (!user || !(await user.correctPassword(password, user.password))) {
        res.status(401).send("incorrect email or password");
      } else {
        this.createSendToken(user, 200, res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  getUser = async (req, res) => {
    try {
      const resUser = await User.findById(req.params.id);
      return res.status(200).json({
        status: "success",
        data: resUser,
        // message: "deposit Successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  updateUser = async (req, res) => {
    try {
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      const resUser = await User.findByIdAndUpdate(req.params.id, req.body);
      return res.status(200).json({
        status: "success",
        data: resUser,
        // message: "deposit Successfully!",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  changePassword = async (req, res) => {
    try {
      let user = await User.findById(req.params.id);
      if (await user.correctPassword(req.body.oldPassword, user.password)) {
        let pass = await bcrypt.hash(req.body.newPassword, 10);
        const resUser = await User.findByIdAndUpdate(req.params.id, {
          password: pass,
        });
        return res.status(200).json({
          status: "success",
          data: resUser,
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "Your Old Password is Incorrect!",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: "error",
        message: "server error",
      });
    }
  };

  async sendCode(req, res) {
    try {
      console.log("inside");
      const { email } = req.body;
      const user = await User.findOne({ email });
      if (!user)
        return res.status(401).json({
          message: "Invalid Email",
        });
      await EmailHelpers.sendForgotPasswordCode(user, req, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new Auth();
