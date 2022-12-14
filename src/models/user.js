const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

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

// hashing password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

// bcrypt compare password
userSchema.methods.correctPassword = async function (userPassword, password) {
  return await bcrypt.compare(userPassword, password);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
