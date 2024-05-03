var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import { SignInError } from "../errors/error.constructors.js";
import PendingUser from "../models/PendingUser.js";
config();
// imports
function generateToken(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return jwt.sign({ payload }, String(process.env.JWT_SECRET), {
            expiresIn: "3h",
        });
    });
}
// sign in
function signInController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, password } = req.body;
        try {
            const user = yield User.findOne({ email });
            if (!user) {
                const isPending = yield PendingUser.findOne({ email });
                // if is pending
                if (isPending)
                    throw new SignInError("email", "chek inbox to verify it!!");
                throw new SignInError("email", "not registered yet!!");
            } // if no user
            const isPassword = yield bcrypt.compare(password, String(user.password));
            if (!isPassword)
                throw new SignInError("password", "wrong credentials!!"); // if no password
            res
                .status(301)
                .cookie("jwt", yield generateToken(user._id), {
                maxAge: 1000 * 60 * 60 * 3,
                secure: true,
                // domain: ".sisttara.com",
            })
                .json({ success: true });
        }
        catch (error) {
            return res.status(404).json({ error });
        }
    });
}
///
// sign up
function signUpController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = req.body;
        try {
            if ((yield User.findOne({ email: user.email })) ||
                (yield PendingUser.findOne({ email: user.email })))
                throw new SignInError("email", "already regestered!!");
            yield PendingUser.create(Object.assign(Object.assign({}, user), { isActive: false }));
            res.status(201).json({ success: true });
        }
        catch (error) {
            res.status(500).send({ error });
        }
    });
}
///
// activation
function activationController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { activationcode } = req.params;
        try {
            // activate the email
            const user = yield PendingUser.findOneAndDelete({
                activationCode: activationcode,
            });
            ///
            yield User.create({
                fName: user === null || user === void 0 ? void 0 : user.fName,
                lName: user === null || user === void 0 ? void 0 : user.lName,
                email: user === null || user === void 0 ? void 0 : user.email,
                password: user === null || user === void 0 ? void 0 : user.password,
                branch: user === null || user === void 0 ? void 0 : user.branch,
                semester: user === null || user === void 0 ? void 0 : user.semester,
            });
            if (!user)
                throw new Error("there is no user");
            return res.status(200).json({ success: true });
        }
        catch (error) {
            res.status(404).json({ error: error.message });
        }
    });
}
///
// sign out
function signOutController(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res
            .status(201)
            .cookie("jwt", "", { maxAge: 0, domain: ".sisttara.com" })
            .json({ success: true });
    });
}
///
export { signInController, signUpController, activationController, signOutController, };
