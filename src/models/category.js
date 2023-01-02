const mongoose = require("mongoose");
// creating catogry schema to store admin products categories
const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
