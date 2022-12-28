const productModel = require("../models/productModel");
const Category = require("../models/category");
const UserModal = require("../models/user");
const bookingModal = require("../models/bookingModal");

exports.addProduct = async (req, res) => {
  try {
    var weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var d = new Date();
    var dayName = weekdays[d.getDay()];
    console.log("dayName", dayName);

    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil(days / 7);
    console.log("week", weekNumber);

    req.body.addedDate = `${dayName}-${weekNumber}`;
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
exports.updateProductImages = async (req, res) => {
  try {
    let img;
    if (req.files) {
      img = req.files[0].location;
      let product = await productModel.findByIdAndUpdate(req.params.id, {
        $push: { moreImages: img },
      });
    }
    res.status(201).json({
      status: "success",
      // data: product,
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

exports.getUserAnalytics = async (req, res) => {
  try {
    var weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var d = new Date();
    var dayName = weekdays[d.getDay()];
    console.log("dayName", dayName);

    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil(days / 7);
    console.log("week", weekNumber);

    let usersWithDates = [];
    for (let i = 0; i < weekdays.length; i++) {
      let joiningDay = `${weekdays[i]}-${weekNumber}`;
      let cat = await UserModal.find({ joiningDay });
      usersWithDates.push(cat?.length);
    }
    console.log("usersWithDates", usersWithDates);
    res.status(201).json({
      status: "success",
      data: usersWithDates,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};

exports.productAnalytics = async (req, res) => {
  try {
    var weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    var d = new Date();
    var dayName = weekdays[d.getDay()];
    console.log("dayName", dayName);

    let currentDate = new Date();
    let currentYear = currentDate.getFullYear();
    let startDate = new Date(currentDate.getFullYear(), 0, 1);
    let days = Math.floor((currentDate - startDate) / (24 * 60 * 60 * 1000));
    let weekNumber = Math.ceil(days / 7);
    console.log("week", weekNumber);

    let productWithDates = [];
    for (let i = 0; i < weekdays.length; i++) {
      let addedDate = `${weekdays[i]}-${weekNumber}`;
      let cat = await bookingModal.find({ addedDate });
      productWithDates.push(cat?.length);
    }
    console.log("productWithDates", productWithDates);
    res.status(201).json({
      status: "success",
      data: productWithDates,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
