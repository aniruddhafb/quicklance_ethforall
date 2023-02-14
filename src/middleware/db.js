import mongoose, { connect } from "mongoose";

const connectDB = async () => {
  mongoose.set("strictQuery", false);

  mongoose.connect(process.env.MONGODB_URI);
};

export default connectDB;
