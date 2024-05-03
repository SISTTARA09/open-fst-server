import mongoose from "mongoose";
// imports

// schema
const userSchema = new mongoose.Schema({
	fName: String,
	lName: String,
	email: String,
	branch: String,
	password: String,
	semester: String,
});
///

export default mongoose.model("User", userSchema);
