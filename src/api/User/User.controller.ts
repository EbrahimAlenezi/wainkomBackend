import { Request, Response } from "express";
import { User } from "../../model/User";

/// is done
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getuserById = async (req: Request, res: Response) => {
  try {
  const { id } = req.params;
  const userId = await User.findById(id);
  res.status(200).json(User);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// needs testing
export const updateUser = async (req: Request, res: Response) => { 
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, req.body, { new: true });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// needs testing
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.body;
  await User.findByIdAndDelete(userId);
  res.status(200).json({ msg: "User deleted" });
};
// needs testing
export const deleteAllUsers = async (req: Request, res: Response) => {
  await User.deleteMany();
    res.status(200).json({ msg: "All users deleted" });
};

