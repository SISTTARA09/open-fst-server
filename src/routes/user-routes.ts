import { Router } from "express";
import { profileController } from "../controllers/user-controllers.js";
import passport from "passport";

const userRouter = Router();

userRouter.get(
	"/profile",
	passport.authenticate("jwt", { session: false }),
	profileController
);

export { userRouter };

// description
/*
- when the client request a protected route,
-- the passport.authenticate("jwt") middleware fired.
--- it will go to config file...
-- if the operation is fullfield, the controller will get the user from "req.user"
*/
