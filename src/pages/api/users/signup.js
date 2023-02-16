// import connectDB from "@/middleware/db";
import User from "@/models/User";
import connectDB from "@/middleware/db";
export default async function handler(req, res) {
  await connectDB();
  if (req.method === "POST") {
    const {
      username,
      email,
      fullName,
      wallet,
      age,
      role,
      about,
      twitter,
      github,
      linkedin,
      image,
    } = req.body;

    let user_name = await User.findOne({ username });
    let user_wallet = await User.findOne({ wallet });
    if (user_name)
      return res.status(500).json({ error: "Username Already Taken" });
    if (user_wallet)
      return res.status(500).json({ error: "Account Already Exists" });
    let newUser = await User.create({
      username,
      email,
      fullName,
      wallet,
      age,
      role,
      about,
      twitter,
      github,
      linkedin,
      image,
    });

    res.status(200).json(newUser);
  }
}
