// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from "@/models/User";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const freelancers = await User.find({ role: "freelancer" });
    res.status(200).json(freelancers);
  }
}
