const express = require("express");
const authRoutes = require("./authRoutes");
const adminRoutes = require("./adminRoutes");
const reviewRoutes = require("./reviewRoutes");

let router = express.Router();

router.use("/auth", authRoutes);
router.use("/admin", adminRoutes);
router.use("/review", reviewRoutes);

module.exports = router;
