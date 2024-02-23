// pages/api/update-user.js
import { Profile } from '@/models/Profile';
import { mongooseConnect } from "@/lib/mongoose";

export default async function handler(req, res) {

    const { method } = req;
    await mongooseConnect();

    if (req.method === 'GET') {
        const { email } = req.query;
        const profile = await Profile.findOne({ user: email });
        res.status(200).json(profile || null);
    }

    if (method === 'POST') {
        const { user, college, year, branch, enroll, phone, name } = req.body;
        const profile = await Profile.create({
            user, college, year, branch, enroll, phone, name
        })
        res.json(profile);
    }

    if (method === 'PUT') {
        const { user, college, year, branch, enroll, phone, name } = req.body;
        await Profile.updateOne({ user }, { college, year, branch, enroll, phone, name });
        res.json(true);
    }
}
