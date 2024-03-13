const { BoPhans } = require("../models");

const getDepartment = async (req, res) => {
	try {
		const department = req.query.id ? await BoPhans.findByPk(req.query.id) : await BoPhans.findAll();
		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}
		return res.json(department);
	} catch (e) {
		res.status(500).json({ message: e });
	}
};
const createDepartment = async (req, res) => {
	try {
		const department = await Department.findByPk(req.query.id);
		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}
		await Department.create({
			Name: req.body.name,
			DepartmentCode: req.body.departmentCode,
			PhoneNumber: req.body.phoneNumber,
			Fax: req.body.fax,
			Email: req.body.email,
			Status: req.body.status,
		});
		return res.status(201).json({ message: "Department created successfully" });
	} catch (e) {}
};
const updateDepartment = async (req, res) => {
	try {
		const department = await Department.findByPk(req.query.id);
		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}
		await department.update({
			Name: req.body.name,
			DepartmentCode: req.body.departmentCode,
			PhoneNumber: req.body.phoneNumber,
			Fax: req.body.fax,
			Email: req.body.email,
			Status: req.body.status,
		});
		return res.status(200).json({ message: "Department updated successfully" });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};
const deleteDepartment = async (req, res) => {
	try {
		const department = await Department.findByPk(req.query.id);
		if (!department) {
			return res.status(404).json({ message: "Department not found" });
		}
		await department.destroy();
		return res.status(200).json({ message: "Department deleted successfully" });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

module.exports = {
	getDepartment,
};
