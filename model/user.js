const mongoose = require("mongoose");
const passport_local_mongoose = require("passport-local-mongoose");
try {
  mongoose.connect("mongodb://localhost/adminANDuserAuthentication");
  console.log("Connected to MongoDB!");
} catch (e) {
  console.error("Failed to connect to MongoDB:", e);
  console.Console.log(e);
}
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
