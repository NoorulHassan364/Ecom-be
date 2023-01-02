//Importing the user model
const User = require("../../models/user");
//Requiring the jsonwebtoken package for authentication
const jwt = require("jsonwebtoken");
//Requiring the bcryptjs package for encrypting the password
const bcrypt = require("bcryptjs");
//Importing the email helpers module for to send the forgot passwod password mails
const EmailHelpers = require("../../utils/emails");

class Auth {
  //Function to handle signup request
  signup = async (req, res) => {
    try {
      // declaring variable for week days
      var weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      // In the following lines we are calculating the date on which the user is registering so that we can tack the users by this date in admin anaytics
      var d = new Date();
      var dayName = weekdays[d.getDay()];
      let currentDate = new Date();
      let currentYear = currentDate.getFullYear();
      let startDate = new Date(currentDate.getFullYear(), 0, 1);
      let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
      let weekNumber = Math.ceil(days / 7);
      console.log("week", weekNumber);

      req.body.joiningDay = `${dayName}-${weekNumber}`;
      // -----------------------------------------------------
      //Creating the user into the database
      const data = await User.create(req.body);
      //sending the response
      res.status(201).json({
        status: "success",
        message: "signup successfully!",
        data: data,
      });
    } catch (error) {
      //handling the error
      console.log(error);
      res.status(500).json({
        status: "error",
        message: error,
      });
    }
  };

  //function to create jwt token
  createSendToken = (user, statusCode, res) => {
    const token = this.signToken(user._id);
    user.password = undefined;
    //sending response to frontend for the login
    res.status(statusCode).json({
      status: "success",
      token,
      user: user,
    });
  };

  // creating token
  signToken = (id) => {
    //signing the token
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
  };

  // user login
  LogIn = async (req, res, next) => {
    try {
      //destructuring the email and password coming from the frontend
      const { email, password } = req.body;
      if (!email || !password) {
        //if email or password are emptyh then sending the error to the frontend
        res.status(400).send("incorrect email or password");
      }
      //finding the user if user already exist with same email
      const user = await User.findOne({ email });
      // comparing the password of the user that is coming from the frontend to that is saved into the DB
      if (!user || !(await user.correctPassword(password, user.password))) {
        //if password is incorrect then sending error the frontend
        res.status(401).send("incorrect email or password");
      } else {
        // function to create jwt token and sending the login response to the frontend
        this.createSendToken(user, 200, res);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // getting user by id for their profile
  getUser = async (req, res) => {
    try {
      // finding user by their id
      const resUser = await User.findById(req.params.id);
      // sending user to the frontend
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

  // this function will run when user update their profile
  updateUser = async (req, res) => {
    try {
      // if user is updating their password then we are first encrypting it
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      // find the user and updating
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

  // function will run when user will change their password
  changePassword = async (req, res) => {
    try {
      // finding user by their id
      let user = await User.findById(req.params.id);
      // comparing the user old password if it is correct or not
      if (await user.correctPassword(req.body.oldPassword, user.password)) {
        // if correct then encrypting the new password
        let pass = await bcrypt.hash(req.body.newPassword, 10);
        // updating user with their new password
        const resUser = await User.findByIdAndUpdate(req.params.id, {
          password: pass,
        });
        return res.status(200).json({
          status: "success",
          data: resUser,
        });
      } else {
        // if old password will incorrect then we throughing the error
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
  // function will run when user forgot the password
  async sendCode(req, res) {
    try {
      // finding user by their email
      const { email } = req.body;
      const user = await User.findOne({ email });
      // if user will not exist then sending error
      if (!user)
        return res.status(401).json({
          message: "Invalid Email",
        });
      // if exist then sending the code to their email
      await EmailHelpers.sendForgotPasswordCode(user, req, res);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new Auth();
