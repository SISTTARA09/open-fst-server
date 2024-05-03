var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
export const sendMail = (email, activationCode) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail({
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
    }
    catch (error) {
        throw new Error(error.message);
    }
});
