// requiring the express pkg to making the routes
const express = require("express");
const Router = express.Router();
// requiring the controller to handle all the requests related to authentication
const authController = require("../../controllers/Auth/authController");
// route for signup
Router.post("/signup", authController.signup);
// route for login
Router.post("/login", authController.LogIn);
// route for getting user for their profile
Router.get("/getUser/:id", authController.getUser);
// route for update user when user will update their profile
Router.patch("/updateUser/:id", authController.updateUser);
// route for changePassword when user will update their changePassword
Router.patch("/changePassword/:id", authController.changePassword);
// route for forgotPassword when user will forgotPassword
Router.post("/forgotPassword", authController.sendCode);

module.exports = Router;
