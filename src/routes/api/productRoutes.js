const express = require("express");
const Router = express.Router();
const productController = require("../../controllers/productController");
Router.post("/checkout-session/:userId", productController.getCheckOutSession);
Router.get("/bookings/:id", productController.getBookings);

module.exports = Router;
