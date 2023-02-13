import connectDB from "@/middleware/db";
import User from "@/models/User";

export default async function handler(req, res) {
  await connectDB();
  if (req.method === "POST") {
    const {
      username,
      email,
      fullName,
      wallets,
      age,
      role,
      about,
      twitter,
      github,
      linkedin,
    } = req.body;
    let user = await User.findOne({ username });
    if (user) return res.status(500).json({ error: "User Already Exists" });
    let newUser = await User.create({
      username,
      email,
      fullName,
      wallets,
      age,
      role,
      about,
      twitter,
      github,
      linkedin,
    });

    res.status(200).json(newUser);
  }
}
