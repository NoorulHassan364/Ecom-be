//Importing the productModel model
const productModel = require("../models/productModel");
//Importing the category model
const Category = require("../models/category");
//Importing the user model
const UserModal = require("../models/user");
//Importing the bookingModal model
const bookingModal = require("../models/bookingModal");

exports.addProduct = async (req, res) => {
  try {
    // declaring variable for week days
    var weekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    // In the following lines we are calculating the date on which the user is registering so that we can tack the users by this date in admin anaytics
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
    // -----------------------------------------------------
    // if the admin is updating the image of the product then we are storing it in aws s3
    if (req.files) {
      let img = req.files[0];
      req.body.image = img?.location;
    }
    // creating product
    let product = await productModel.create(req.body);
    // sendign the product on the frontend
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
// function will run when will do to the products page
exports.getProducts = async (req, res) => {
  try {
    // finding all products and sending to the admin dashboard
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
// funciton will run when admin update any product
exports.updateProduct = async (req, res) => {
  try {
    // if he will update the image then we are storing it to aws s3
    if (req.files) {
      let img = req.files[0];
      if (img) {
        req.body.image = img?.location;
      }
    }
    // finding and updating the product
    let product = await productModel.findByIdAndUpdate(req.params.id, req.body);
    // sending to the frontend
    res.status(201).json({
      status: "success",
      data: product,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
// function will run when admin will add multiple images in the product
exports.updateProductImages = async (req, res) => {
  try {
    let img;
    // storing all the images into the aws
    if (req.files) {
      img = req.files[0].location;
      // updating that product after ading images
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
// function will when admin will delete any product
exports.deleteProduct = async (req, res) => {
  try {
    // finding and deleting the product
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

// function will run when we go the product detail page
exports.getProduct = async (req, res) => {
  try {
    // finding the product and sending it to frontend
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
// function will run for getting the related catogory products in the product detail page section
exports.getProductsByCategory = async (req, res) => {
  try {
    // finding all the product related to the same catogory
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
// function will run when admin go to the categories page
exports.getCategories = async (req, res) => {
  try {
    // finding all the categories and sending to the amdin
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
// funcion will run when admin add new category
exports.addCategory = async (req, res) => {
  try {
    // creating category
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
// function will run when admin delete category
exports.deleteCategory = async (req, res) => {
  try {
    // finding and deleting the category
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
// funcion will run when admin update category
exports.updateCategory = async (req, res) => {
  try {
    // finding and updating the cateogry
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
// function will run when admin go the analytics page
exports.getUserAnalytics = async (req, res) => {
  try {
    // In the following lines we are calculating the admin analytics of this week
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
    // .................................
    let usersWithDates = [];
    for (let i = 0; i < weekdays.length; i++) {
      // finding all the user who joind this week
      let joiningDay = `${weekdays[i]}-${weekNumber}`;
      let cat = await UserModal.find({ joiningDay });
      // pushing found user into the array
      usersWithDates.push(cat?.length);
    }
    res.status(201).json({
      status: "success",
      data: usersWithDates,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
// function will run to calculate product analytics
exports.productAnalytics = async (req, res) => {
  try {
    // in the following lines we are calculating the product analytics for current week
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
    // .............................................
    let productWithDates = [];
    for (let i = 0; i < weekdays.length; i++) {
      let addedDate = `${weekdays[i]}-${weekNumber}`;
      // finding and pushing all the products into an array
      let cat = await bookingModal.find({ addedDate });
      productWithDates.push(cat?.length);
    }
    // sending to frontend
    res.status(201).json({
      status: "success",
      data: productWithDates,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send(error.message);
  }
};
