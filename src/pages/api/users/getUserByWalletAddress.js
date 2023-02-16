// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/middleware/db";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const { wallet } = req.body;
    let user = await User.findOne({ wallet });
    if (!user)
      return res
        .status(500)
        .json({ success: false, error: "Cannot Find User" });
    res.status(200).json(user);
  }
}
