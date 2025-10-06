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


export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// needs testing
export const updateUser = async (req: Request, res: Response) => { 
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const allowedFields = ["username", "email", "bio", "phone", "organization"] as const;
    const updateData: Record<string, unknown> = {};

    for (const key of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        updateData[key] = (req.body as any)[key];
      }
    }

    // Handle optional image upload via multer
    if ((req as any).file) {
      const file = (req as any).file as { path?: string; filename?: string };
      updateData.image = file.path || `Uploads/${file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// needs testing
export const deleteUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const deleted = await User.findByIdAndDelete(req.user._id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// needs testing
export const deleteAllUsers = async (req: Request, res: Response) => {
  await User.deleteMany();
    res.status(200).json({ msg: "All users deleted" });
};

