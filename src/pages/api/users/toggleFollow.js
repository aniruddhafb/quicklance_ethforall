// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";
import connectDB from "@/middleware/db";
export default async function handler(req, res) {
  await connectDB();
  if (req.method === "POST") {
    const { to_follow_wallet, user_wallet } = req.body;
    let to_follow_user = await User.findOne({ wallet: to_follow_wallet });
    let user = await User.findOne({ wallet: user_wallet });

    let check = await to_follow_user.followings.includes(user_wallet);
    if (!check) {
      await to_follow_user.followings.push(user_wallet);
      await user.followers.push(to_follow_wallet);
    } else {
      await to_follow_user({ $pull: { followings: user_wallet } });
      await user({ $pull: { followers: to_follow_wallet } });
    }

    res.status(200).json({ to_follow_user, user });
  }
}
