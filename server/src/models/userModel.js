const mongoose = require("mongoose");

const schema = mongoose.Schema;

const userSchema = new schema({
  loginId: { type: mongoose.Types.ObjectId, ref: "login_tb" },
  name: { type: String },
  email: { type: String },
  phonenumber: { type: String },
  house: { type: String },
  street: { type: String },
  town: { type: String },
  state: { type: String },
  district: { type: String },
  city: { type: String },
  pincode: { type: String },
});

const userModel = mongoose.model("user_tb", userSchema);
module.exports = userModel;
