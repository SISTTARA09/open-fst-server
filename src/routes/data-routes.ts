import { Router } from "express";
import {
	getAllDocs,
	getAllPlayLists,
	getSessionDocs,
	getSessionPlaylists,
} from "../controllers/data-controllers.js";
// imports

const dataRouter = Router(); // router

// methods
// dataRouter.get("/:branch/:semester/:module", getStudentData);
///

// get all docs (for all modules)
dataRouter.get("/docs/:branch/:semester", getAllDocs);

// get single doc (for specified module)
dataRouter.get("/docs/:branch/:semester/:module/:session", getSessionDocs);

// get all playlits (for all modules)
dataRouter.get("/playlists/:branch/:semester", getAllPlayLists);

// get signle playlist (for specified module)
dataRouter.get("/playlists/:branch/:semester/:session", getSessionPlaylists);

export { dataRouter };
