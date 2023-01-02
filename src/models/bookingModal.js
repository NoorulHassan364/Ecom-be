const mongoose = require("mongoose");
// making booking schema to store user products history
const bookingSchema = new mongoose.Schema({
  // declaring all the attributes and their types for the schema
  prod: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  quantity: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  addedDate: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
