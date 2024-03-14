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
	updateLibrary,
	deleteLibrary,
	shareDirectory,
} = require("../controllers/file.controller");

const router = Router();

// router.get("/user", verifyToken, getUser);

// router.get("/department", verifyToken, getDepartment);

// router.get("/job", verifyToken, getJobTitle);

// router.get("/employee", verifyToken, getEmployee);

router.get("/library", verifyToken, getLibrary);
router.post("/library", verifyToken, createLibrary);
router.get("/personalItem", verifyToken, getPersonalFolder);
router.post("/sharedFolder", verifyToken, shareDirectory);
router.put("/library", verifyToken, updateLibrary);
router.delete("/library", verifyToken, deleteLibrary);

module.exports = router;
