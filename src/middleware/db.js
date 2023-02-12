const mongoose = require("mongoose");

const connectDB = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }
};

export default connectDB;
