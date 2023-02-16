const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    image: String,
    followers: {
      type: [String],
      unique: true,
    },
    followings: {
      type: [String],
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    wallet: String,
    age: Number,
    about: String,
    role: {
      type: String,
      enum: ["freelancer", "employer", "company"],
    },
    twitter: String,
    github: String,
    linkedin: String,
  },
  {
    timestamps: true,
  }
);

mongoose.models = {};
export default mongoose.models.User || mongoose.model("User", UserSchema);
