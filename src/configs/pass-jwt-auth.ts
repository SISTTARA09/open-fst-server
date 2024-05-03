import passport from "passport";
import pjwt from "passport-jwt";
import User from "../models/User.js";
import { config } from "dotenv";
config();
/// imports

const JwtStrategy = pjwt.Strategy;
const ExtractJwt = pjwt.ExtractJwt;

passport.use(
	new JwtStrategy(
		{
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: String(process.env.JWT_SECRET),
		},
		async (jwt_payload: any, done: any) => {
			try {
				const user = await User.findById(jwt_payload.payload);
				return done(null, user);
			} catch (error: any) {
				done(error, false);
			}
		}
	)
);

// description

/*
- in options object "JwtFromRequest" will recieve the token,
-- it will verify it with the "secretOrKey",
--- if token valid the callBack will fire,
---- take payload ('_id'), chek if the user is in db, then set it to the "req" Object controller.
--- if token not valid will send 'Unauthorized'.
*/
