import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User";
import { Org } from "../model/Org";
export const signupOrg = async (req: Request, res: Response) => {
  try {
    const { name, email, password, orgName, orgAddress, bio, contacts } = req.body;

    
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      type: "org"
    });

    
    const org = await Org.create({
      name: orgName,
      address: orgAddress,
      bio,
      contacts,
      userId: user._id,
      isApproved: false 
    });

    res.status(201).json({ user, org });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
