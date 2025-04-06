const mongoose = require("mongoose");

const schema = mongoose.Schema;

const loginSchema = new schema({
  username: { type: String },
  password: { type: String },
  role: { type: String },
  status: { type: String },
});

const loginModel = mongoose.model("login_tb", loginSchema);
module.exports = loginModel;
