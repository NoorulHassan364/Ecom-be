// creating express router to manage admin routes
const express = require("express");
const Router = express.Router();
// importing adminController to handle request
const adminController = require("../../controllers/adminController");
// importing multer to upload product images
const { multerUploadS3 } = require("../../utils/multer");
// route to create product
Router.post("/product", multerUploadS3.any(), adminController.addProduct);
// route to get all the products
Router.get("/products", adminController.getProducts);
// route to delete product
Router.delete("/product/:id", adminController.deleteProduct);
// route to update product
Router.patch(
  "/product/:id",
  multerUploadS3.any(),
  adminController.updateProduct
);
// route to add multiple images into the product
Router.patch(
  "/product/images/:id",
  multerUploadS3.any(),
  adminController.updateProductImages
);
// route to get product detail
Router.get("/product/:id", adminController.getProduct);
// route to get same category related products
Router.get("/product", adminController.getProductsByCategory);
// route to create categories
Router.post("/category", adminController.addCategory);
// route to get all categories
Router.get("/category", adminController.getCategories);
// route to delete category
Router.delete("/category/:id", adminController.deleteCategory);
// route update category
Router.patch("/category/:id", adminController.updateCategory);
// route to get userAnalytics
Router.get("/userAnalytics", adminController.getUserAnalytics);
// route to get productAnalytics
Router.get("/productAnalytics", adminController.productAnalytics);

module.exports = Router;
