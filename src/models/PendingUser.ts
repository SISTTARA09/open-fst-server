import mongoose from "mongoose";
import * as bcrypt from "bcrypt";
import { sendMail } from "../configs/auth-mail.js";
import crypto from "node:crypto";
/// imports

const pendingUserSchema = new mongoose.Schema({
	fName: String,
	lName: String,
	email: {
		type: String,
		required: [true, "Enter your email!!"],
		unique: true,
	},
	branch: String,
	password: String,
	isActive: Boolean,
	activationCode: String,
	semester: String,
});

pendingUserSchema.pre("save", async function (next) {
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(String(this.password), salt);

	const buf = crypto.randomBytes(19);
	try {
		this.activationCode = buf.toString("hex");
		await sendMail(this.email, this.activationCode);
		next();
	} catch (error) {
		console.log("error in sending email\n");
	}
});

export default mongoose.model("PendingUser", pendingUserSchema);
