import { Profile } from "@/models/Profile";
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {
    await mongooseConnect();
    const { email } = req.query;
    const seller = await Profile.findOne({ user: email });
    res.status(200).json(seller);
}