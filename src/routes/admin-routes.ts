import { Router } from "express";
import {
	deleteSingleDoc,
	deleteSingleVideo,
	postModuleDocs,
	postPlayList,
	postSingleDocToModule,
	postSingleVideoToPlaylist,
} from "../controllers/admin-controllers.js";
import formidable from "formidable";
/// imports
const adminRouter = Router();

adminRouter.post("/add/docs", postModuleDocs);
adminRouter.post("/add/playlist", postPlayList);

// Post docs
adminRouter.patch("/add/doc", postSingleDocToModule);
adminRouter.patch("/add/video", postSingleVideoToPlaylist);

// Delete docs
adminRouter.delete("/delete/doc", deleteSingleDoc);
adminRouter.delete("/delete/video", deleteSingleVideo);

export { adminRouter };
