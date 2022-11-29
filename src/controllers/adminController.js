const productModel = require("../models/productModel");
const Category = require("../models/category");

exports.addProduct = async (req, res) => {
  try {
    if (req.files) {
      let img = req.files[0];
      req.body.image = img?.location;
    }

    let product = await productModel.create(req.body);
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getProducts = async (req, res) => {
  try {
    let shops = await productModel.find({});
    res.status(201).json({
      status: "success",
      data: shops,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.updateProduct = async (req, res) => {
  try {
    if (req.files) {
      let img = req.files[0];
      if (img) {
        req.body.image = img?.location;
      }
    }
    let product = await productModel.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    let product = await productModel.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getProduct = async (req, res) => {
  try {
    let product = await productModel.findById(req.params.id);
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getProductsByCategory = async (req, res) => {
  try {
    let products = await productModel.find({ category: req.query.category });
    res.status(201).json({
      status: "success",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.getCategories = async (req, res) => {
  try {
    let cat = await Category.find({});
    res.status(201).json({
      status: "success",
      data: cat,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.addCategory = async (req, res) => {
  try {
    let cat = await Category.create(req.body);
    res.status(201).json({
      status: "success",
      data: cat,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    let cat = await Category.findByIdAndDelete(req.params.id);
    res.status(201).json({
      status: "success",
      data: cat,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    let cat = await Category.findByIdAndUpdate(req.params.id, req.body);
    res.status(201).json({
      status: "success",
      data: cat,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
