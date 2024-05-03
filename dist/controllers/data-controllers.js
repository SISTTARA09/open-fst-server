var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CourPlayList, TDPlayList } from "../models/PlayList.js";
import { TDDoc, CourDoc, ExamDoc } from "../models/Doc.js";
// imports
function checkForBranchAndSemester(branch, semester) {
    return __awaiter(this, void 0, void 0, function* () {
        // check for branch
        const userBranch = ["mip", "bcg", "gegm"].filter((ele) => ele === branch.toLowerCase())[0];
        if (!userBranch)
            throw new Error("this branch is not exist!!");
        ///
        // check for semester
        const userSemester = ["s1", "s2", "s3", "s4"].filter((ele) => ele === semester.toLowerCase())[0];
        if (!userSemester)
            throw new Error("this semster is not exist!!");
        ///
        return { userBranch, userSemester };
    });
}
// get all docs of a "branch/semester"
function getAllDocs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { branch, semester } = req.params;
        try {
            const { userBranch, userSemester } = yield checkForBranchAndSemester(branch, semester);
            const courDocs = yield CourDoc.find({
                semester: userSemester,
                branch: userBranch,
            });
            const tdDocs = yield TDDoc.find({
                semester: userSemester,
                branch: userBranch,
            });
            const examDocs = yield ExamDoc.find({
                semester: userSemester,
                branch: userBranch,
            });
            const docs = { courDocs, tdDocs, examDocs };
            if (!docs)
                throw new Error("there is no data");
            res.status(200).json({ docs, success: true });
        }
        catch (error) {
            res.status(404).json({ message: error.message, success: false });
        }
    });
}
///
// get docs of a module
function getSessionDocs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { branch, semester, module, session } = req.params;
        try {
            const { userBranch, userSemester } = yield checkForBranchAndSemester(branch, semester);
            let doc = null;
            switch (session) {
                case "cour":
                    doc = yield CourDoc.findOne({
                        semester: userSemester,
                        branch: userBranch,
                        module: module.replace("_", " "),
                    });
                    break;
                case "td":
                    doc = yield TDDoc.findOne({
                        semester: userSemester,
                        branch: userBranch,
                        module: module.replace("_", " "),
                    });
                    break;
                case "exam":
                    doc = yield ExamDoc.findOne({
                        semester: userSemester,
                        branch: userBranch,
                        module: module.replace("_", " "),
                    });
                    break;
                default:
                    throw new Error("is session is not exist!!");
            }
            if (!doc)
                throw new Error("there is no data");
            res.status(200).json({ doc, success: true });
        }
        catch (error) {
            res.status(404).json({ message: error.message, success: false });
        }
    });
}
// get all playlists of a "branch/semester"
function getAllPlayLists(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { branch, semester } = req.params;
        try {
            const { userBranch, userSemester } = yield checkForBranchAndSemester(branch, semester);
            const courPlaylists = yield CourPlayList.find({
                semester: userSemester,
                branch: userBranch,
            });
            const tdPlaylists = yield TDPlayList.find({
                semester: userSemester,
                branch: userBranch,
            });
            const playlists = { courPlaylists, tdPlaylists };
            if (!playlists)
                throw new Error("there is no data");
            res.status(200).json({ playlists, success: true });
        }
        catch (error) {
            res.status(404).json({ message: error.message, success: false });
        }
    });
}
//  get a playlist of a module
function getSessionPlaylists(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { branch, semester, session } = req.params;
        try {
            const { userBranch, userSemester } = yield checkForBranchAndSemester(branch, semester);
            let playlists = null;
            switch (session.toLocaleLowerCase()) {
                case "cour":
                    playlists = yield CourPlayList.find({
                        semester: userSemester,
                        branch: userBranch,
                    });
                    break;
                case "td":
                    playlists = yield TDPlayList.find({
                        semester: userSemester,
                        branch: userBranch,
                    });
                    break;
                default:
                    throw new Error("this session is not exist!!");
            }
            if (!playlists)
                throw new Error("there is no data");
            res.status(200).json({ playlists, success: true });
        }
        catch (error) {
            res.status(404).json({ message: error.message, success: false });
        }
    });
}
///
export { getAllDocs, getSessionDocs, getAllPlayLists, getSessionPlaylists };
