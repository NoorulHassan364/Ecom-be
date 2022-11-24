const productModel = require("../models/productModel");

exports.addReview = async (req, res) => {
  try {
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
