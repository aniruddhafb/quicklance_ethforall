const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = Schema({
  username: {
    type: String,
    required: true,
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
  wallets: [String],
  role: {
    type: String,
    enum: ["employee", "employer"],
  },
  twitter: String,
  github: String,
  linkedin: String,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
