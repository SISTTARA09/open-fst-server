import { config } from "dotenv";
import nodemailer from "nodemailer";
config();
/// imports

const transporter = nodemailer.createTransport({
	service: "gmail",
	host: "smtp.gmail.com",
	port: 587,
	secure: false,
	auth: {
		user: process.env.NODE_MAILER_USER,
		pass: process.env.NODE_MAILER_SENDER_PASS,
	},
});

export const sendMail = async (email: string, activationCode: string) => {
	try {
		await transporter.sendMail({
			from: `"${process.env.NODE_MAILER_SENDER_NAME} " ${process.env.NODE_MAILER_SENDER_EMAIL}`,
			to: email,
			subject: "email verification",
			text: "verify you account",
			html: `<div>
      <h1 style="color: red;">Hi, activation page:)</h1>
      <p>to activate you account:</p></br>
      <h3><a href="${process.env.NODE_MAILER_CLIENT_ADRESS}/auth/confirm/${activationCode}">click here:)</a></h3>
      </div>`,
		});
	} catch (error: any) {
		throw new Error(error.message);
	}
};
