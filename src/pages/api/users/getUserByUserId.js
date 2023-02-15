// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method == "POST") {
    const { userId } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(500).json({ error: "Cannot find this user" });
    res.status(200).json(user);
  }
}
