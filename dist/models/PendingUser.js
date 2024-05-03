var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
pendingUserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield bcrypt.genSalt(10);
        this.password = yield bcrypt.hash(String(this.password), salt);
        const buf = crypto.randomBytes(19);
        try {
            this.activationCode = buf.toString("hex");
            yield sendMail(this.email, this.activationCode);
            next();
        }
        catch (error) {
            console.log("error in sending email\n");
        }
    });
});
export default mongoose.model("PendingUser", pendingUserSchema);
