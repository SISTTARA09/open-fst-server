import express from "express";
import { CourPlayList, TDPlayList } from "../models/PlayList.js";
import { TDDoc, CourDoc, ExamDoc } from "../models/Doc.js";
// imports

async function checkForBranchAndSemester(
	branch: string,
	semester: string
): Promise<{ userBranch: string; userSemester: string }> {
	// check for branch
	const userBranch = ["mip", "bcg", "gegm"].filter(
		(ele) => ele === branch.toLowerCase()
	)[0];

	if (!userBranch) throw new Error("this branch is not exist!!");
	///

	// check for semester
	const userSemester = ["s1", "s2", "s3", "s4"].filter(
		(ele) => ele === semester.toLowerCase()
	)[0];

	if (!userSemester) throw new Error("this semster is not exist!!");
	///
	return { userBranch, userSemester };
}

// get all docs of a "branch/semester"
async function getAllDocs(req: express.Request, res: express.Response) {
	const { branch, semester } = req.params;

	try {
		const { userBranch, userSemester } = await checkForBranchAndSemester(
			branch,
			semester
		);

		const courDocs = await CourDoc.find({
			semester: userSemester,
			branch: userBranch,
		});
		const tdDocs = await TDDoc.find({
			semester: userSemester,
			branch: userBranch,
		});
		const examDocs = await ExamDoc.find({
			semester: userSemester,
			branch: userBranch,
		});

		const docs = { courDocs, tdDocs, examDocs };

		if (!docs) throw new Error("there is no data");
		res.status(200).json({ docs, success: true });
	} catch (error: any) {
		res.status(404).json({ message: error.message, success: false });
	}
}
///

// get docs of a module
async function getSessionDocs(req: express.Request, res: express.Response) {
	const { branch, semester, module, session } = req.params;

	try {
		const { userBranch, userSemester } = await checkForBranchAndSemester(
			branch,
			semester
		);

		let doc = null;
		switch (session) {
			case "cour":
				doc = await CourDoc.findOne({
					semester: userSemester,
					branch: userBranch,
					module: module.replace("_", " "),
				});
				break;
			case "td":
				doc = await TDDoc.findOne({
					semester: userSemester,
					branch: userBranch,
					module: module.replace("_", " "),
				});
				break;
			case "exam":
				doc = await ExamDoc.findOne({
					semester: userSemester,
					branch: userBranch,
					module: module.replace("_", " "),
				});
				break;
			default:
				throw new Error("is session is not exist!!");
		}
		if (!doc) throw new Error("there is no data");
		res.status(200).json({ doc, success: true });
	} catch (error: any) {
		res.status(404).json({ message: error.message, success: false });
	}
}

// get all playlists of a "branch/semester"
async function getAllPlayLists(req: express.Request, res: express.Response) {
	const { branch, semester } = req.params;

	try {
		const { userBranch, userSemester } = await checkForBranchAndSemester(
			branch,
			semester
		);

		const courPlaylists = await CourPlayList.find({
			semester: userSemester,
			branch: userBranch,
		});
		const tdPlaylists = await TDPlayList.find({
			semester: userSemester,
			branch: userBranch,
		});

		const playlists = { courPlaylists, tdPlaylists };

		if (!playlists) throw new Error("there is no data");
		res.status(200).json({ playlists, success: true });
	} catch (error: any) {
		res.status(404).json({ message: error.message, success: false });
	}
}

//  get a playlist of a module
async function getSessionPlaylists(
	req: express.Request,
	res: express.Response
) {
	const { branch, semester, session } = req.params;

	try {
		const { userBranch, userSemester } = await checkForBranchAndSemester(
			branch,
			semester
		);

		let playlists = null;
		switch (session.toLocaleLowerCase()) {
			case "cour":
				playlists = await CourPlayList.find({
					semester: userSemester,
					branch: userBranch,
				});
				break;
			case "td":
				playlists = await TDPlayList.find({
					semester: userSemester,
					branch: userBranch,
				});
				break;
			default:
				throw new Error("this session is not exist!!");
		}

		if (!playlists) throw new Error("there is no data");
		res.status(200).json({ playlists, success: true });
	} catch (error: any) {
		res.status(404).json({ message: error.message, success: false });
	}
}
///

export { getAllDocs, getSessionDocs, getAllPlayLists, getSessionPlaylists };
