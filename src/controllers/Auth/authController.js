const User = require("../../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
}

module.exports = new Auth();
