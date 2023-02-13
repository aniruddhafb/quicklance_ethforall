const mongoose = require("mongoose");

// const connectDB = (handler) => async (req, res) => {
//   if (mongoose.connections[0].readyState) {
//     return handler(req, res);
//   }
// };

// export default connectDB;

const connectMongo = async (req, res) =>
  mongoose.connect("mongodb://localhost:27017");

export default connectMongo;
