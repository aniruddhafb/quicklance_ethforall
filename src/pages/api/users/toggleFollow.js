// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/middleware/db";

export default async function handler(req, res) {
  await connectDB();
  if (req.method === "POST") {
    const { to_follow_wallet, user_wallet } = req.body;
    if (to_follow_wallet === user_wallet)
      return res.status(500).json({ error: "You Cannot Follow Yourself" });
    let to_follow_user = await User.findOne({ wallet: to_follow_wallet });
    let user = await User.findOne({ wallet: user_wallet });

    if (to_follow_user.followers.includes(user_wallet)) {
      await to_follow_user.followers.pull(user_wallet);
      await user.followings.pull(to_follow_wallet);
    } else {
      await to_follow_user.followers.push(user_wallet);
      await user.followings.push(to_follow_wallet);
    }
    await to_follow_user.save();
    await user.save();
    res.status(200).json({ to_follow_user, user });
  }
}
