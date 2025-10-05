import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../../model/User";
import { Org } from "../../model/Organizer";
import { generatetoken } from "../../Utils/jwt";
// Sign up is working
export const signup = async (req: Request, res: Response) => {
  try {
    const { 
      username, 
      email, 
      password, 
      isOrganizer,
      // Organizer fields (only required if isOrganizer is true)
      orgName,
      orgAddress,
      orgImage,
      orgBio,
      orgPhone,
      orgWebsite,
      orgEmail
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "Email already used" });

    const hashed = await bcrypt.hash(password, 10);

    // Create user first
    const user = await User.create({
      username,
      email,
      password: hashed,
      isOrganizer: isOrganizer,
    });

    let organizer = null;

    // If user is registering as organizer, create organizer profile
    if (isOrganizer) {
      // Validate required organizer fields
      const missing: string[] = [];
      if (!orgName) missing.push("orgName");
      if (!orgAddress) missing.push("orgAddress");
      if (!orgImage) missing.push("orgImage");
      if (!orgPhone) missing.push("orgPhone");
      if (!orgEmail) missing.push("orgEmail");
      
      if (missing.length) {
        // If organizer fields are missing, delete the created user and return error
        await User.findByIdAndDelete(user._id);
        return res.status(400).json({ 
          message: `Missing required organizer fields: ${missing.join(", ")}` 
        });
      }

      // Create organizer profile
      organizer = await Org.create({
        owner: user._id,
        name: orgName,
        address: orgAddress,
        image: orgImage,
        bio: orgBio || "",
        phone: orgPhone,
        website: orgWebsite || "",
        email: orgEmail
      });

      // Link organizer profile to user
      await user.updateOne({ $set: { organization: organizer._id } });
    }

    const token = generatetoken(user, user.username, organizer);

    res.status(201).json({ 
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        isOrganizer: user.isOrganizer,
        organization: organizer ? organizer._id : null
      },
      organizer: organizer
    });
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

  // Fetch organizer data if user is an organizer
  let organizer = null;
  if (user.isOrganizer && user.organization) {
    organizer = await Org.findById(user.organization);
  }

  const token = generatetoken(user, user.username, organizer);

  res.json({ 
    token,
    user: {
      _id: user._id,
      username: user.username,
      email: user.email,
      isOrganizer: user.isOrganizer,
      organization: user.organization || null
    },
    organizer: organizer
  });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
};