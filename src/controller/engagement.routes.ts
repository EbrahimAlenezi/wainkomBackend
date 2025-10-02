// routes/engagement.routes.ts
import express from "express";
import {
  saveEngagement,
  getUserEngagements,
  removeEngagement,
} from "../controller/engagement.controller";
import { authorize } from "../Middleware/authorization";

const router = express.Router();

router.post("/",authorize, saveEngagement);
router.get("/:userId",authorize ,getUserEngagements);
router.delete("/:id", authorize, removeEngagement);

export default router;
