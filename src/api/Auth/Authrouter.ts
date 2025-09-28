import { Router } from "express";
import { signup, login, } from "../Auth/Authcontroller";
import { signupOrg } from "./OrgAuthcontroller.ts";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/signup-org", signupOrg);


export default router;
