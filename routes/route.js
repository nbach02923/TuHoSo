const Router = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const { getUser } = require("../controllers/user.controller");
const { getDepartment } = require("../controllers/department.controller");
const { getJobTitle } = require("../controllers/job.controller");
const { getEmployee } = require("../controllers/employee.controller");
const {
	getLibrary,
	createLibrary,
	getPersonalFolder,
	deleteLibrary,
	shareDirectory,
	getFilterLibrary,
	createAndUpdateFolder,
	deleteFolder,
	moveFolder,
} = require("../controllers/file.controller");

const router = Router();

router.get("/", function (req, res) {
	res.send("Hello World");
});

// router.get("/user", verifyToken, getUser);

// router.get("/department", verifyToken, getDepartment);

// router.get("/job", verifyToken, getJobTitle);

// router.get("/employee", verifyToken, getEmployee);

router.route("/GetThuVien").get(verifyToken, getLibrary);
router.route("/SetThuVien").post(verifyToken, createLibrary);
router.route("/SetFolderMau").post(verifyToken, createAndUpdateFolder);
router.route("/GetShareFolder").post(verifyToken, getPersonalFolder);
router.route("/ShareFolder").post(verifyToken, shareDirectory);
router.route("/DeleteThuVien").get(verifyToken, deleteLibrary);
router.route("/DeleteFolder").get(verifyToken, deleteFolder);
router.route("/GetListThuVienFilter").post(verifyToken, getFilterLibrary);
router.route("/MoveFolder").post(verifyToken, moveFolder);

module.exports = router;
