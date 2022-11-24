const express = require("express");
const Router = express.Router();
const adminController = require("../../controllers/adminController");
const { multerUploadS3 } = require("../../utils/multer");

Router.post("/product", multerUploadS3.any(), adminController.addProduct);
Router.get("/products", adminController.getProducts);
Router.delete("/product/:id", adminController.deleteProduct);
Router.patch(
  "/product/:id",
  multerUploadS3.any(),
  adminController.updateProduct
);
Router.get("/product/:id", adminController.getProduct);
Router.get("/product", adminController.getProductsByCategory);

module.exports = Router;
