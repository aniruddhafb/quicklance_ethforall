// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/middleware/db";

export default async function handler(req, res) {
  await connectDB();

  if (req.method === "POST") {
    const {
      _id,
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
      image,
    } = req.body;

    let user_acc = await User.findById(_id);
    if (!user_acc)
      return res
        .status(200)
        .json({ success: false, error: "Cannot Find This User" });

    const user = await User.findByIdAndUpdate(
      _id,
      {
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
        image,
      },
      { new: true }
    );

    res.status(200).json(user);
  }
}
