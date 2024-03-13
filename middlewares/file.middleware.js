const util = require("util");
const multer = require("multer");
const crypto = require("crypto");
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads");
	},
	filename: (req, file, cb) => {
		const newFileName = crypto.randomUUID();
		const fileExt = file.originalname.split(".").pop();
		cb(null, `${newFileName}.${fileExt}`);
	},
});
const uploadFile = multer({
	storage: storage,
}).single("file");

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
