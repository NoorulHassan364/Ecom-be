// Requiring the mongoose package to develop the connection to the MongoDB
const mongoose = require("mongoose");
// conneting to the mongoDB
mongoose
  .connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    // after connecting showing this message into the console to know if it is connected or not
    console.log("DB successfully connected!");
  })
  .catch((err) => {
    console.log(err);
  });
