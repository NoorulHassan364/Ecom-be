// Importing product model
const productModel = require("../models/productModel");
// funcion will run when any user write a product review
exports.addReview = async (req, res) => {
  try {
    // finding the product and creating review for that prod
    let review = await productModel.findByIdAndUpdate(
      req.params.prodId,
      { $push: { reviews: req.body.review } },
      { new: true }
    );
    res.status(201).json({
      status: "success",
      data: review,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
