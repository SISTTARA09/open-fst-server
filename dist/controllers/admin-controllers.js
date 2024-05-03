var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { uploadToDb } from "../utils/add-doc.js";
import { v2 as cloudinary } from "cloudinary";
import { CourDoc, TDDoc } from "../models/Doc.js";
import { CourPlayList, TDPlayList } from "../models/PlayList.js";
import formidable from "formidable";
/// imports
// cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
///
// document
function postModuleDocs(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = req.body;
        try {
            switch (formData.session) {
                case "cour":
                    yield CourDoc.create(Object.assign({}, formData));
                    break;
                case "td":
                    yield TDDoc.create(Object.assign({}, formData));
                    break;
                default:
                    throw new Error("this session is not supported!!");
            }
            res.json({
                message: "document is added successfully:)",
                success: true,
            });
        }
        catch (error) {
            res.json({
                message: error.message,
                success: false,
            });
        }
    });
}
///
// Post Single Document
function postSingleDocToModule(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const form = formidable({ multiples: true });
        form.parse(req, (err, fields, files) => __awaiter(this, void 0, void 0, function* () {
            let data = {};
            if (fields) {
                for (const key in fields) {
                    data[key] = Object(fields)[key][0];
                }
            }
            console.log("data: ", data);
            if (err) {
                console.error(err);
                return res.status(400).json({ message: "Error parsing form data" });
            }
            const uploadedFile = files.doc; // Assuming a single file input named "file"
            if (!uploadedFile) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            try {
                const uploadResult = yield cloudinary.uploader.upload(uploadedFile[0].filepath);
                yield uploadToDb(data, uploadResult.secure_url);
                res.status(200).json({
                    message: "File uploaded successfully",
                    url: uploadResult.secure_url,
                });
            }
            catch (error) {
                console.error("error: ", error);
                res.status(500).json({ message: "Error uploading file" });
            }
        }));
        // console.log("body_: ", form);
        // try {
        // 	const buffer = Buffer.from(data.doc);
        // 	console.log("buffer", buffer);
        // 	cloudinary.uploader
        // 		.upload_stream(
        // 			{ resource_type: "raw" },
        // 			async (error: any, result: any) => {
        // 				if (error) throw new Error("Error in uploading to cloudinary!!");
        // 				const docURL = result?.secure_url; // img url
        // 				await uploadToDb(data, docURL);
        // 			}
        // 		)
        // 		.end();
        // 	res.json({
        // 		message: "successfully uploaded:)",
        // 		success: true,
        // 	});
        // } catch (error) {
        // 	console.log("error: ", error);
        // 	res.json({
        // 		message: " uploading is failed:)",
        // 		success: false,
        // 	});
        // }
    });
}
// play list
function postPlayList(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = req.body;
        try {
            switch (formData.session) {
                case "cour":
                    yield CourPlayList.create(Object.assign({}, formData));
                    break;
                case "td":
                    yield TDPlayList.create(Object.assign({}, formData));
                    break;
                default:
                    throw new Error("this session is not supporteeed!!");
            }
            res.json({
                message: "video module is added successfully:)",
                success: true,
            });
        }
        catch (error) {
            res.json({
                message: error.message,
                success: false,
            });
        }
    });
}
function postSingleVideoToPlaylist(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = req.body;
        console.log(true);
        let updateResponse;
        // upload to mongo db
        try {
            switch (formData.session) {
                case "cour":
                    updateResponse = yield CourPlayList.updateOne({
                        module: String(formData.module),
                        semester: String(formData.semester),
                    }, {
                        $push: {
                            videos: {
                                title: formData.title,
                                path: formData.path,
                            },
                        },
                    });
                    if (!updateResponse.matchedCount)
                        throw new Error("palylist is not found!!");
                    if (!updateResponse.modifiedCount)
                        throw new Error("video is failed to uploaded!!");
                    break;
                case "td":
                    updateResponse = yield TDPlayList.updateOne({
                        module: String(formData.module),
                        semester: String(formData.semester),
                    }, {
                        $push: {
                            videos: {
                                title: formData.title,
                                path: formData.path,
                            },
                        },
                    });
                    if (!updateResponse.matchedCount)
                        throw new Error("palylist is not found!!");
                    if (!updateResponse.modifiedCount)
                        throw new Error("video is failed to uploaded!!");
                    break;
                default:
                    throw new Error("this session is not supportffed!!");
            }
            res.json({
                message: "video uploaded successfully:)",
                success: true,
            });
        }
        catch (error) {
            res.json({
                message: error.message,
                success: false,
            });
        }
    });
}
// delete a doc
function deleteSingleDoc(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = req.body;
        let updateResponse;
        // delete form db
        try {
            switch (formData.session) {
                case "cour":
                    updateResponse = yield CourDoc.updateOne({
                        module: String(formData.module),
                        semester: String(formData.semester),
                    }, {
                        $pull: {
                            docs: {
                                title: String(formData.title),
                            },
                        },
                    });
                    if (!updateResponse.matchedCount)
                        throw new Error("doc is not found!!");
                    if (!updateResponse.modifiedCount)
                        throw new Error("doc is failed to delete!!");
                    break;
                case "td":
                    updateResponse = yield TDDoc.updateOne({
                        module: String(formData.module),
                        semester: String(formData.semester),
                    }, {
                        $pull: {
                            docs: {
                                title: formData.title,
                            },
                        },
                    });
                    if (!updateResponse.matchedCount)
                        throw new Error("doc is not found!!");
                    if (!updateResponse.modifiedCount)
                        throw new Error("doc is failed to delete!!");
                    break;
                default:
                    throw new Error("this session is not supported!!");
            }
            res.json({
                message: "doc successfully deleted:)",
                success: true,
            });
        }
        catch (error) {
            return res.json({ message: error.message, success: false });
        }
    });
}
///
/// imports
function deleteSingleVideo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const formData = req.body;
        // const formValues = Object.fromEntries(data);
        let updateResponse;
        console.log(formData);
        // delete from mongo db
        try {
            switch (formData.session) {
                case "cour":
                    updateResponse = yield CourPlayList.updateOne({
                        module: String(formData.module),
                        semester: String(formData.semester),
                    }, {
                        $pull: {
                            videos: {
                                title: formData.title,
                            },
                        },
                    });
                    if (!updateResponse.matchedCount)
                        throw new Error("video is not found!!");
                    if (!updateResponse.modifiedCount)
                        throw new Error("video is failed to delete!!");
                    break;
                case "td":
                    updateResponse = yield TDPlayList.updateOne({
                        module: String(formData.module),
                        semester: String(formData.semester),
                    }, {
                        $pull: {
                            videos: {
                                title: formData.title,
                            },
                        },
                    });
                    if (!updateResponse.matchedCount)
                        throw new Error("video is not found!!");
                    if (!updateResponse.modifiedCount)
                        throw new Error("video is failed to delete!!");
                    break;
                default:
                    throw new Error("this session is not supported!!");
            }
            res.json({
                message: "video is deleted successfully:)",
                success: true,
            });
        }
        catch (error) {
            return res.json({ message: error.message, success: false });
        }
    });
}
///
export { postModuleDocs, postPlayList, postSingleDocToModule, postSingleVideoToPlaylist, deleteSingleDoc, deleteSingleVideo, };
