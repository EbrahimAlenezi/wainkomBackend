import { Request, Response } from "express";
import { Org } from "../../model/Organizer";
import { User } from "../../model/User";

export const createOrganizer = async (req: Request, res: Response) => {
 try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.isOrganizer !== true) {
      return res.status(403).json({ message: "User is not an organizer" });
    }
    console.log(authUser)
    const { name, address, image, bio, phone, website } = req.body;
    const organizer = await Org.create({ 
      owner: authUser._id,
      name, 
      address, 
      image, 
      bio, 
      phone, 
      website 
    });
    res.status(201).json(organizer);
 } catch (error) {
    res.status(500).json({ error: error });
 }
};

export const updateOrganizer = async (req: Request, res: Response) => {
  try {
    const authUser = (req as any).user;
    if (!authUser || !authUser._id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const user = await User.findById(authUser._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (user.isOrganizer !== true) {
      return res.status(403).json({ message: "User is not an organizer" });
    }
  }
  catch (error) {
    res.status(500).json({ error: error });
  }
};