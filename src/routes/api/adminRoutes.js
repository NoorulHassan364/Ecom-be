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
Router.patch(
  "/product/images/:id",
  multerUploadS3.any(),
  adminController.updateProductImages
);
Router.get("/product/:id", adminController.getProduct);
Router.get("/product", adminController.getProductsByCategory);

Router.post("/category", adminController.addCategory);
Router.get("/category", adminController.getCategories);
Router.delete("/category/:id", adminController.deleteCategory);
Router.patch("/category/:id", adminController.updateCategory);

Router.get("/userAnalytics", adminController.getUserAnalytics);
Router.get("/productAnalytics", adminController.productAnalytics);

module.exports = Router;
