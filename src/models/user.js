const mongoose = require("mongoose");
// requiring the bcrypt package to encrypt the password
const bcrypt = require("bcryptjs");
// making user schema and defining the their fields with types
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: [true, "email already exist"],
    required: [true, "you must have an email"],
  },
  phone: {
    type: String,
  },
  gender: {
    type: String,
  },
  address: {
    type: String,
  },
  password: {
    type: String,
  },
  userType: {
    type: String,
  },
  joiningDay: {
    type: String,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// // encrpting the  password before saving the user to the db.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

// // function to compare password when user will be logged in. it will return true and false.
userSchema.methods.correctPassword = async function (userPassword, password) {
  return await bcrypt.compare(userPassword, password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
