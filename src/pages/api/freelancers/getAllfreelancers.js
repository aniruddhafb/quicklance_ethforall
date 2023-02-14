// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectDB from "@/middleware/db";
import User from "@/models/User";
export default async function handler(req, res) {
  await connectDB();
  const freelancers = await User.find({ role: "employee" });

  await res.status(200).json({ freelancers });
}
