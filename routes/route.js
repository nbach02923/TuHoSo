const Router = require("express");
const verifyToken = require("../middlewares/auth.middleware");
const { getUser } = require("../controllers/user.controller");
const { getDepartment } = require("../controllers/department.controller");
const { getJobTitle } = require("../controllers/job.controller");
const { getEmployee } = require("../controllers/employee.controller");
const {
	getLibrary,
	createLibrary,
	deleteLibrary,
	shareDirectory,
	getFilterLibrary,
	createAndUpdateFolder,
	deleteFolder,
	moveFolder,
	getSharedHistory,
	applyToFolder,
	moveProjectFolder,
} = require("../controllers/file.controller");
const { getGroupUser } = require("../controllers/groupuser.controller");

const router = Router();

router.get("/", function (req, res) {
	res.send("Hello World");
});

router.route("/GetUser").post(verifyToken, getUser);

router.route("/GetBoPhan").post(verifyToken, getDepartment);

router.route("/GetGroupUser").post(verifyToken, getGroupUser);

// router.get("/job", verifyToken, getJobTitle);

// router.get("/employee", verifyToken, getEmployee);

router.route("/GetThuVien").get(verifyToken, getLibrary);
router.route("/SetThuVien").post(verifyToken, createLibrary);
router.route("/SetFolderMau").post(verifyToken, createAndUpdateFolder);
router.route("/ShareFolder").post(verifyToken, shareDirectory);
router.route("/DeleteThuVien").get(verifyToken, deleteLibrary);
router.route("/DeleteFolder").get(verifyToken, deleteFolder);
router.route("/GetListThuVienFilter").post(verifyToken, getFilterLibrary);
router.route("/MoveFolder").post(verifyToken, moveFolder);
router.route("/GetLichSuChiaSe").post(verifyToken, getSharedHistory);
router.route("/SetToThuMuc").post(verifyToken, applyToFolder);
router.route("/MoveProjectFolder").post(verifyToken, moveProjectFolder);

module.exports = router;
