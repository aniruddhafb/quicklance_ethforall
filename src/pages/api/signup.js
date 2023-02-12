import connectDB from "@/middleware/db";
import User from "@/models/User";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const { username, email, fullName, wallets, role } = res.body;
    let user = await User.findOne({ username });
    if (user) return res.status(500).json({ error: "User Already Exists" });
    let newUser = await User.create({
      username,
      email,
      fullName,
      wallets,
      role,
    });
    res.json(newUser);
  }
};

export default connectDB(handler);
