import { uploadToDb } from "../utils/add-doc.js";
import { v2 as cloudinary } from "cloudinary";
import express from "express";
import { CourDoc, TDDoc } from "../models/Doc.js";
import { CourPlayList, TDPlayList } from "../models/PlayList.js";
import { UpdateWriteOpResult } from "mongoose";
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
async function postModuleDocs(req: express.Request, res: express.Response) {
	const formData = req.body;
	try {
		switch (formData.session) {
			case "cour":
				await CourDoc.create({ ...formData });
				break;
			case "td":
				await TDDoc.create({ ...formData });
				break;
			default:
				throw new Error("this session is not supported!!");
		}
		res.json({
			message: "document is added successfully:)",
			success: true,
		});
	} catch (error: any) {
		res.json({
			message: error.message,
			success: false,
		});
	}
}
///

// Post Single Document
async function postSingleDocToModule(req: any, res: express.Response) {
	const form = formidable({ multiples: true });
	const data = req.body;
	form.parse(req, async (err, fields, files) => {
		let data: any = {};
		if (fields) {
			for (const key in fields) {
				data[key] = fields[key][0];
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
			const uploadResult = await cloudinary.uploader.upload(
				uploadedFile[0].filepath
			);
			await uploadToDb(data, uploadResult.secure_url);
			res.status(200).json({
				message: "File uploaded successfully",
				url: uploadResult.secure_url,
			});
		} catch (error) {
			console.error("error: ", error);
			res.status(500).json({ message: "Error uploading file" });
		}
	});

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
}

// play list

async function postPlayList(req: express.Request, res: express.Response) {
	const formData = req.body;

	try {
		switch (formData.session) {
			case "cour":
				await CourPlayList.create({ ...formData });
				break;
			case "td":
				await TDPlayList.create({ ...formData });
				break;
			default:
				throw new Error("this session is not supporteeed!!");
		}
		res.json({
			message: "video module is added successfully:)",
			success: true,
		});
	} catch (error: any) {
		res.json({
			message: error.message,
			success: false,
		});
	}
}

async function postSingleVideoToPlaylist(
	req: express.Request,
	res: express.Response
) {
	const formData = req.body;
	console.log(true);
	let updateResponse: UpdateWriteOpResult;
	// upload to mongo db
	try {
		switch (formData.session) {
			case "cour":
				updateResponse = await CourPlayList.updateOne(
					{
						module: String(formData.module),
						semester: String(formData.semester),
					},
					{
						$push: {
							videos: {
								title: formData.title,
								path: formData.path,
							},
						},
					}
				);
				if (!updateResponse.matchedCount)
					throw new Error("palylist is not found!!");
				if (!updateResponse.modifiedCount)
					throw new Error("video is failed to uploaded!!");
				break;

			case "td":
				updateResponse = await TDPlayList.updateOne(
					{
						module: String(formData.module),
						semester: String(formData.semester),
					},
					{
						$push: {
							videos: {
								title: formData.title,
								path: formData.path,
							},
						},
					}
				);
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
	} catch (error: any) {
		res.json({
			message: error.message,
			success: false,
		});
	}
}

// delete a doc

async function deleteSingleDoc(req: express.Request, res: express.Response) {
	const formData = req.body;

	let updateResponse: UpdateWriteOpResult;

	// delete form db
	try {
		switch (formData.session) {
			case "cour":
				updateResponse = await CourDoc.updateOne(
					{
						module: String(formData.module),
						semester: String(formData.semester),
					},
					{
						$pull: {
							docs: {
								title: String(formData.title),
							},
						},
					}
				);
				if (!updateResponse.matchedCount) throw new Error("doc is not found!!");
				if (!updateResponse.modifiedCount)
					throw new Error("doc is failed to delete!!");
				break;

			case "td":
				updateResponse = await TDDoc.updateOne(
					{
						module: String(formData.module),
						semester: String(formData.semester),
					},
					{
						$pull: {
							docs: {
								title: formData.title,
							},
						},
					}
				);
				if (!updateResponse.matchedCount) throw new Error("doc is not found!!");
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
	} catch (error: any) {
		return res.json({ message: error.message, success: false });
	}
}
///

/// imports

async function deleteSingleVideo(req: express.Request, res: express.Response) {
	const formData = req.body;
	// const formValues = Object.fromEntries(data);
	let updateResponse: UpdateWriteOpResult;
	console.log(formData);
	// delete from mongo db
	try {
		switch (formData.session) {
			case "cour":
				updateResponse = await CourPlayList.updateOne(
					{
						module: String(formData.module),
						semester: String(formData.semester),
					},
					{
						$pull: {
							videos: {
								title: formData.title,
							},
						},
					}
				);
				if (!updateResponse.matchedCount)
					throw new Error("video is not found!!");
				if (!updateResponse.modifiedCount)
					throw new Error("video is failed to delete!!");
				break;

			case "td":
				updateResponse = await TDPlayList.updateOne(
					{
						module: String(formData.module),
						semester: String(formData.semester),
					},
					{
						$pull: {
							videos: {
								title: formData.title,
							},
						},
					}
				);
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
	} catch (error: any) {
		return res.json({ message: error.message, success: false });
	}
}
///

export {
	postModuleDocs,
	postPlayList,
	postSingleDocToModule,
	postSingleVideoToPlaylist,
	deleteSingleDoc,
	deleteSingleVideo,
};
