// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { to_follow_wallet, user_wallet } = req.body;
    let to_follow_user = await User.findOne({ wallet: to_follow_wallet });
    let user = await User.findOne({ wallet: user_wallet });

    if (!to_follow_user && !user)
      return res.status(500).json({ error: "cannot find user" });

    if (to_follow_user.followers.includes(user_wallet)) {
      return res.status(200).json({
        isFollowing: true,
        followers_length: to_follow_user.followers.length,
      });
    } else {
      return res
        .status(200)
        .json({
          isFollowing: false,
          followers_length: to_follow_user.followers.length,
        });
    }
  }
}
