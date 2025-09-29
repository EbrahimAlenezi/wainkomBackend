import { UserDoc } from "../model/User";

declare global {
  namespace Express {
    interface Request {
      user?: UserDoc;
    }
  }
}