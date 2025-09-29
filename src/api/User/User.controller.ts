import { Request, Response } from "express";
import { User } from "../../model/User";

export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const updateUser = async (req: Request, res: Response) => { 
  const { userId } = req.body;
  const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
  res.status(200).json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.body;
  await User.findByIdAndDelete(userId);
  res.status(200).json({ msg: "User deleted" });
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  await User.deleteMany();
  res.status(200).json({ msg: "All users deleted" });
};