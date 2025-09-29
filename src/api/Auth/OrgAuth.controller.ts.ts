// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { Org } from "../../model/Org";
// import { User } from "../../model/User";


// export const signupOrg = async (req: Request, res: Response) => {
//   try {
//     const { name, email, password, address, bio, phone, website } = req.body;

    
//     const hashed = await bcrypt.hash(password, 10);

//     const org = await Org.create({
//       name,
//       email, 
//       password: hashed,
//       address,
//       bio,
//       phone,
//       website,
//     });

//     res.status(201).json({ org });
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };

// export const loginOrg = async (req: Request, res: Response) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//   if (!user) return res.status(400).json({ msg: "Invalid credentials" });

//   const valid = await bcrypt.compare(password, user.password);
//   if (!valid) return res.status(400).json({ msg: "Invalid credentials" });


//     const token = jwt.sign
//       ({ id: org._id },
//       process.env.JWT_Secret!,
//       { expiresIn: "7d" }
//     );

//     res.json({ token, name: org.name });
//   } catch (err) {
//     res.status(500).json({ error: err });
//   }
// };