import mongoose, { connect } from "mongoose";

const connectDB = async () => {

  mongoose.connect(process.env.NEXT_PUBLIC_MONGODB_URI);
};

export default connectDB;
