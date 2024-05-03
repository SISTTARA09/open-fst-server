import { CourDoc, TDDoc } from "../models/Doc.js";
import { UpdateWriteOpResult } from "mongoose";
/// imports

async function uploadToDb(formValues: any, docURL: string | undefined) {
	let updateResult: UpdateWriteOpResult;

	// upload to mongo db
	try {
		switch (formValues.session) {
			case "cour":
				updateResult = await CourDoc.updateOne(
					{
						module: String(formValues.module),
						semester: String(formValues.semester),
					},
					{
						$push: {
							docs: {
								title: String(formValues.title),
								type: String(formValues.type),
								doc: String(docURL),
							},
						},
					}
				);
				if (!updateResult.matchedCount)
					throw new Error("this module is not exist!!");
				if (!updateResult.modifiedCount)
					throw new Error("deleting is failed!!");
				break;

			case "td":
				updateResult = await TDDoc.updateOne(
					{
						module: String(formValues.module),
						semester: String(formValues.semester),
					},
					{
						$push: {
							docs: {
								title: formValues.title,
								type: formValues.type,
								doc: docURL,
							},
						},
					}
				);
				if (!updateResult.matchedCount)
					throw new Error("this module is not exist!!");
				if (!updateResult.modifiedCount)
					throw new Error("deleting is failed!!");
				break;
			default:
				throw new Error("this session is not supported!!");
		}
		return { success: true };
	} catch (error: any) {
		throw new Error(error.message);
	}
}
export { uploadToDb };
