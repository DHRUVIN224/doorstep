const mongoose = require("mongoose");

const schema = mongoose.Schema;
const messageSchema = new schema({
  message: { type: String },
  userId: { type: mongoose.Types.ObjectId, ref: "user_tb" },
  buissnessId: { type: mongoose.Types.ObjectId, ref: "buissness_tb" },
  time: { type: String },
  type: { type: String },
});
const messageModel = mongoose.model("message_tb", messageSchema);
module.exports = messageModel;
