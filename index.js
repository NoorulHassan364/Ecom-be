// requiring the env file so that we can secure our important variables
require("dotenv").config();
const express = require("express");
// requring cors pkg , so that we can send the response on the frontend
const cors = require("cors");
require("dotenv").config({ path: `${__dirname}/../.env` });
// dotenv.config({ path: "./config.env" });
const productController = require("./src/controllers/productController");
//making app, and requiring the db and routes
const app = express();
require("./src/db/connection");
const routes = require("./src/routes");
//using cors as a middleware

app.use(cors());
app.use(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  productController.webhookCheckout
);

//converting request body to json so that backend will understand it
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));
//requiring the routes
app.use(express.static("build"));
app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("hi there");
  res.end();
});
//starting our backend on port 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
