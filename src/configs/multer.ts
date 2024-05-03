// const multer = require("multer");

// const storage = multer.diskStorage({
// 	destination: function (
// 		_req: any,
// 		_file: File,
// 		cb: (obj: null, directory: string) => void
// 	) {
// 		cb(null, "uploads/"); // Change 'uploads/' to your desired directory
// 	},
// 	filename: function (
// 		_req: any,
// 		file: any,
// 		cb: (obj: null, directory: string) => void
// 	) {
// 		cb(null, Date.now() + "-" + file.originalname);
// 	},
// });

// const upload = multer({ storage: storage });
