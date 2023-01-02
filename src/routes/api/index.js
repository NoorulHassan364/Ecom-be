const express = require("express");
//requiring the authentication routes
const authRoutes = require("./authRoutes");
//requiring the adminRoutes routes
const adminRoutes = require("./adminRoutes");
//requiring the reviewRoutes routes
const reviewRoutes = require("./reviewRoutes");
//requiring the productRoutes routes
const productRoutes = require("./productRoutes");

let router = express.Router();
// all the routes in one place
router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/review", reviewRoutes);
router.use("/product", productRoutes);

module.exports = router;
