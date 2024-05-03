import mongoose from "mongoose";

const playListSchema = new mongoose.Schema({
	branch: {
		type: String,
		required: [true, "Enter wich branches!!"],
	},
	module: {
		type: String,
		required: [true, "enter module name"],
	},
	semester: {
		type: String,
		required: [true, "enter semester name"],
	},
	owner: String,
	description: {
		type: String,
		// required: [true, "Enter a description for the playlist"],
	},
	videos: {
		type: Array({
			title: {
				type: String,
				required: [true, "Enter a title for the video!!"],
			},
			path: {
				type: String,
				required: [true, "enter the video path!!"],
			},
		}),
	},
});

// models
const CourPlayList = mongoose.model("CourPlayList", playListSchema);
const TDPlayList = mongoose.model("TDPlayList", playListSchema);
///

export { CourPlayList, TDPlayList };

/**
 *  @param playlist 
 ***  {
	branches: ["mip"],
	semester: "s1",
	module: "circuit",
	owner: "yassine",
	description: "lorem ipsum",
	videos: [
		{
			title: "doc 1 title",
			path: "this is doc",
		},
	],
};
*/
