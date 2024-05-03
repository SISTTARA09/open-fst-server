var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import passport from "passport";
import pjwt from "passport-jwt";
import User from "../models/User.js";
import { config } from "dotenv";
config();
/// imports
const JwtStrategy = pjwt.Strategy;
const ExtractJwt = pjwt.ExtractJwt;
passport.use(new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: String(process.env.JWT_SECRET),
}, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User.findById(jwt_payload.payload);
        return done(null, user);
    }
    catch (error) {
        done(error, false);
    }
})));
// description
/*
- in options object "JwtFromRequest" will recieve the token,
-- it will verify it with the "secretOrKey",
--- if token valid the callBack will fire,
---- take payload ('_id'), chek if the user is in db, then set it to the "req" Object controller.
--- if token not valid will send 'Unauthorized'.
*/
