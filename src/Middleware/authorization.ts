import { User } from '../model/User';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authorize = async (req: Request, res: Response, next: NextFunction) => {
    console.log("Middleware started");

    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    try {
      const decoded = jwt.verify(token, process.env.JWT_Secret!) as { _id: string };
      const user = await User.findById(decoded._id);
      console.log(user)
      if (!user) return res.status(401).json({ message: "Invalid token" });
      req.user = user; // now req.user is typed as UserDoc
      console.log(token)
      next();
    } catch (error) {
      res.status(401).json({ message: "Unauthorized" });
    }
  };