// creating express router to manage review routes
const express = require("express");
const Router = express.Router();
// importing reviewController to manage requests
const reviewController = require("../../controllers/reviewController");
// route to create review for the specific product
Router.post("/:prodId", reviewController.addReview);

module.exports = Router;
