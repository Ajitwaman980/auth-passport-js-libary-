const mongoose = require("mongoose");
const passport_local_mongoose = require("passport-local-mongoose");

const User_Schema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: { type: String, require: true },
  },
  { timestamps: true }
);
User_Schema.plugin(passport_local_mongoose);
const User = mongoose.model("User", User_Schema);
module.exports = User;
