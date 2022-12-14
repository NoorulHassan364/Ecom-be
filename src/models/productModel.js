const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  prodDescription: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  addedDate: {
    type: String,
  },
  moreImages: [
    {
      type: String,
      required: false,
    },
  ],
  reviews: [
    {
      type: String,
      required: false,
    },
  ],
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
