// creating express router to manage product routes
const express = require("express");
const Router = express.Router();
// importing productController to handle requests
const productController = require("../../controllers/productController");
// route to get checkout form
Router.post("/checkout-session/:userId", productController.getCheckOutSession);
// route to get user purchase history
Router.get("/bookings/:id", productController.getBookings);

module.exports = Router;
