import { Router } from "express";
import { signup, login } from "./Auth.controller";
// import { signupOrg } from "./OrgAuth.controller.ts";

const router = Router();

router.post("/signup", signup);
router.post("/signin", login);
// router.post("/signuporg", signupOrg);


export default router;
