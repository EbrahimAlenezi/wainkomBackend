// routes/engagement.routes.ts
import express from "express";
import {
  saveEngagement,
  getUserEngagements,
  removeEngagement,
} from "../controller/engagement.controller";
import { authorize } from "../Middleware/authorization";

const engagementrouter = express.Router();

engagementrouter.post("/", authorize, saveEngagement);
engagementrouter.get("/", authorize, getUserEngagements);
engagementrouter.delete("/:id", authorize, removeEngagement);

export default engagementrouter;
