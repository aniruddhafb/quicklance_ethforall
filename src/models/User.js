const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = Schema(
  {
    username: {
      type: String,
      required: true,
    },
    image: String,
    followers: {
      type: [String],
      sparse: true,
      index: true,
    },
    followings: {
      type: [String],
      sparse: true,
      index: true,
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
