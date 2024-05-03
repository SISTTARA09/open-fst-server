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
import express from "express";
import mongoose from "mongoose";
import "./configs/pass-jwt-auth.js";
import cors from "cors";
import { authRouter } from "./routes/auth-routes.js";
import { userRouter } from "./routes/user-routes.js";
import { dataRouter } from "./routes/data-routes.js";
import { adminRouter } from "./routes/admin-routes.js";
config();
// imports
// app
const app = express();
///
// middlewares
app.use(cors({
    origin: process.env.NODE_MAILER_CLIENT_ADRESS,
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
///
// routes
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/data", dataRouter);
app.use("/admin", adminRouter);
//
app.get("/", (_req, res) => {
    res.send("Hello World this is Forked:)");
});
// listen
(() => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(String(process.env.MONGODB_URI));
        app.listen(process.env.PORT, () => {
            console.log("listenning on port", process.env.PORT);
        });
    }
    catch (error) {
        console.log("not listenning!!");
    }
}))();
///
