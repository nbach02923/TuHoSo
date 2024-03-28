const { BoPhans, Link_FolderTuHoSo_PhongBan } = require("../models");
const { Op } = require("sequelize");

const getDepartment = async (req, res) => {
	try {
		const departments = await BoPhans.findAll({ where: { BoPhanChaPkid: 0 }, order: [["TenBoPhan", "ASC"]] });
		const childrenDepartments = await BoPhans.findAll({
			where: { BoPhanChaPkid: { [Op.ne]: 0 }, order: [["TenBoPhan", "ASC"]] },
		});
		const departmentIds = [...departments.map((d) => d.Id), ...childrenDepartments.map((d) => d.Id)];
		const sharedFolderIds = await Link_FolderTuHoSo_PhongBan.findAll({
			attributes: ["idPhongBan", "idFolderTuHoSo"],
			where: {
				idPhongBan: departmentIds,
			},
		});
		const getChildrenRecursively = (parentId) => {
			const children = childrenDepartments.filter((child) => child.BoPhanChaPkid === parentId);
			return children.map((child) => {
				const childSharedFolderIds = sharedFolderIds
					.filter((sf) => sf.idPhongBan === child.Id)
					.map((sf) => sf.idFolderTuHoSo);
				const sharedTo = `;${childSharedFolderIds.join(";")};`;
				return {
					...child.toJSON(),
					children: getChildrenRecursively(child.Id),
					SharedTo: sharedTo || "",
				};
			});
		};
		const result = departments.map((department) => {
			const departmentSharedFolderIds = sharedFolderIds
				.filter((sf) => sf.idPhongBan === department.Id)
				.map((sf) => sf.idFolderTuHoSo);
			const sharedTo = `;${departmentSharedFolderIds.join(";")};`;
			return {
				...department.toJSON(),
				children: getChildrenRecursively(department.Id),
				SharedTo: sharedTo || "",
			};
		});
		return res.json({ Detail: "Get department successfully", Error: 7, Value: result });
	} catch (e) {
		res.status(200).json({ Detail: e.message, Error: 9, sError: "LoiServer" });
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
