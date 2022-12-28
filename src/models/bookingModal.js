const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
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
