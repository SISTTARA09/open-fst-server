import { Router } from "express";
import {
	activationController,
	signInController,
	signUpController,
	signOutController,
} from "../controllers/auth-controllers.js";

const authRouter = Router();

authRouter.post("/signin", signInController);

authRouter.post("/signup", signUpController);

// activation

authRouter.get("/confirm/:activationcode", activationController);
///

// sign out
authRouter.post("/signout", signOutController);
///
export { authRouter };
