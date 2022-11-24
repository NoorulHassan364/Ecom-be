const express = require("express");
const Router = express.Router();
const reviewController = require("../../controllers/reviewController");

Router.post("/:prodId", reviewController.addReview);

module.exports = Router;
