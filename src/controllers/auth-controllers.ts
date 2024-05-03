import User from "../models/User.js";
import type express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { SignInError } from "../errors/error.constructors.js";
import PendingUser from "../models/PendingUser.js";
config();
// imports

async function generateToken(payload: any) {
	return jwt.sign({ payload }, String(process.env.JWT_SECRET), {
		expiresIn: "3h",
	});
}

// sign in
async function signInController(req: express.Request, res: express.Response) {
	const { email, password } = req.body;
	try {
		const user = await User.findOne({ email });
		if (!user) {
			const isPending = await PendingUser.findOne({ email });
			// if is pending
			if (isPending)
				throw new SignInError("email", "chek inbox to verify it!!");
			throw new SignInError("email", "not registered yet!!");
		} // if no user
		const isPassword = await bcrypt.compare(password, String(user.password));
		if (!isPassword) throw new SignInError("password", "wrong credentials!!"); // if no password
		res
			.status(301)
			.cookie("jwt", await generateToken(user._id), {
				maxAge: 1000 * 60 * 60 * 3,
				secure: true,
				// domain: ".sisttara.com",
			})
			.json({ success: true });
	} catch (error) {
		return res.status(404).json({ error });
	}
}
///

// sign up
async function signUpController(req: express.Request, res: express.Response) {
	const user = req.body;
	try {
		if (
			(await User.findOne({ email: user.email })) ||
			(await PendingUser.findOne({ email: user.email }))
		)
			throw new SignInError("email", "already regestered!!");
		await PendingUser.create({
			...user,
			isActive: false,
		});
		res.status(201).json({ success: true });
	} catch (error: any) {
		res.status(500).send({ error });
	}
}
///

// activation
async function activationController(
	req: express.Request,
	res: express.Response
) {
	const { activationcode } = req.params;
	try {
		// activate the email
		const user = await PendingUser.findOneAndDelete({
			activationCode: activationcode,
		});
		///

		await User.create({
			fName: user?.fName,
			lName: user?.lName,
			email: user?.email,
			password: user?.password,
			branch: user?.branch,
			semester: user?.semester,
		});

		if (!user) throw new Error("there is no user");
		return res.status(200).json({ success: true });
	} catch (error: any) {
		res.status(404).json({ error: error.message });
	}
}
///

// sign out
async function signOutController(_req: express.Request, res: express.Response) {
	res
		.status(201)
		.cookie("jwt", "", { maxAge: 0, domain: ".sisttara.com" })
		.json({ success: true });
}
///
export {
	signInController,
	signUpController,
	activationController,
	signOutController,
};
