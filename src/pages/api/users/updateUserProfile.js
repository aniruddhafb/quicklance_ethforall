// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";

export default async function handler(req, res) {
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
    } = req.body;

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
      },
      { new: true }
    );

    res.status(200).json({ user });
  }
}
