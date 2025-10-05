import { Router } from "express";
import { authorize } from "../../Middleware/authorization";
import { submitRating, getEventReviews, getMyReview, getEventRatingSummary, upsertReviewText } from "./Reviews.controller";

const reviewRoutes = Router();


reviewRoutes.post("/events/:eventId/rate", authorize, submitRating);


reviewRoutes.get("/events/:eventId/reviews", getEventReviews);


reviewRoutes.get("/events/:eventId/my-review", authorize, getMyReview);


reviewRoutes.get("/events/:eventId/rating", getEventRatingSummary);

reviewRoutes.patch("/events/:eventId/review-text", authorize, upsertReviewText);

export default reviewRoutes;


