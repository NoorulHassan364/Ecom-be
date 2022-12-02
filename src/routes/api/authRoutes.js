const express = require("express");
const Router = express.Router();
const authController = require("../../controllers/Auth/authController");

Router.post("/signup", authController.signup);
Router.post("/login", authController.LogIn);
Router.get("/getUser/:id", authController.getUser);
Router.patch("/updateUser/:id", authController.updateUser);
Router.patch("/changePassword/:id", authController.changePassword);

module.exports = Router;
