import { env } from "../../config/config";
import jwt from "jsonwebtoken";

export const generatetoken = (newUser: any, username: String, organizerData?: any) => {
  const payload = { 
    _id: newUser._id, 
    username, 
    isOrganizer: newUser.isOrganizer,
    organization: newUser.organization || null,
    // Include organizer profile data if available
    ...(organizerData && { organizer: organizerData })
  };
  const secret = env.JWT_Secret!;
  const options = { expiresIn: env.JWT_EXP } as jwt.SignOptions;
  const token = jwt.sign(payload, secret, options);
  return token;
};

