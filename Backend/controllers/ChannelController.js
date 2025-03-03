import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";
import mongoose from "mongoose";

export const createChannel = async (req, res) => {
  try {
    const { name, members } = req.body;
    const userId = req.userId;
    const admin = await User.findById(userId);

    if (!admin) {
      return res.status(400).send("Admin user not found.");
    }
    const validMembers = await User.find({ _id: { $in: members } });

    if (validMembers.length !== members.length) {
      return res.status(400).send("Some members are not valid user.");
    }
    const newChannel = new Channel({
      name,
      members,
      admin: userId,
    });
    await newChannel.save();
    return res.status(201).json({ channel: newChannel });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal sever error");
  }
};

export const getUserChannels = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.userId);
    const channels = await Channel.find({
      $or: [{ admin: userId }, { member: userId }],
    }).sort({ updatedAt: -1 });

    return res.status(201).json({ channels });
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal sever error");
  }
};
