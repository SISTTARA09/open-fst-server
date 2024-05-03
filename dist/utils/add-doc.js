var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CourDoc, TDDoc } from "../models/Doc.js";
/// imports
function uploadToDb(formValues, docURL) {
    return __awaiter(this, void 0, void 0, function* () {
        let updateResult;
        // upload to mongo db
        try {
            switch (formValues.session) {
                case "cour":
                    updateResult = yield CourDoc.updateOne({
                        module: String(formValues.module),
                        semester: String(formValues.semester),
                    }, {
                        $push: {
                            docs: {
                                title: String(formValues.title),
                                type: String(formValues.type),
                                doc: String(docURL),
                            },
                        },
                    });
                    if (!updateResult.matchedCount)
                        throw new Error("this module is not exist!!");
                    if (!updateResult.modifiedCount)
                        throw new Error("deleting is failed!!");
                    break;
                case "td":
                    updateResult = yield TDDoc.updateOne({
                        module: String(formValues.module),
                        semester: String(formValues.semester),
                    }, {
                        $push: {
                            docs: {
                                title: formValues.title,
                                type: formValues.type,
                                doc: docURL,
                            },
                        },
                    });
                    if (!updateResult.matchedCount)
                        throw new Error("this module is not exist!!");
                    if (!updateResult.modifiedCount)
                        throw new Error("deleting is failed!!");
                    break;
                default:
                    throw new Error("this session is not supported!!");
            }
            return { success: true };
        }
        catch (error) {
            throw new Error(error.message);
        }
    });
}
export { uploadToDb };
