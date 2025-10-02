import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../model/User";
import { generatetoken } from "../../Utils/jwt";
// Sign up is working
export const signup = async (req: Request, res: Response) => {
  try {
    const { username, email, password, isOrganizer } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashed,
      isOrganizer: isOrganizer,
    });

    const token = generatetoken(user, user.username);

    res.status(201).json({ token  });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
// Login is working
export const login = async (req: Request, res: Response) => {
  try {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ msg: "Invalid credentials" });

  const token = generatetoken(user, user.username);

  res.json({ token});
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};