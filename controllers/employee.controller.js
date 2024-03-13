const { NhanViens, sequelize } = require("../models");
const { QueryTypes } = require("sequelize");

const getEmployee = async (req, res) => {
	try {
		const employeeId = req.query.id;
		const query = employeeId
			? `
			SELECT * 
			FROM "NhanViens" e 
			LEFT JOIN "Link_NhanVien_BoPhan_ChucVu" l ON e."Id" = l."NhanVienPkid" 
			LEFT JOIN "BoPhans" d ON d."Id" = l."BoPhanPkid" 
			LEFT JOIN "ChucVus" j ON j."Id" = l."ChucVuPkid"
			WHERE e."Id" = ${employeeId}
			`
			: `
			SELECT * 
			FROM "NhanViens" e 
			LEFT JOIN "Link_NhanVien_BoPhan_ChucVu" l ON e."Id" = l."NhanVienPkid" 
			LEFT JOIN "BoPhans" d ON d."Id" = l."BoPhanPkid" 
			LEFT JOIN "ChucVus" j ON j."Id" = l."ChucVuPkid"
			`;
		const employee = await sequelize.query(query, { type: QueryTypes.SELECT });
		if (!employee) {
			return res.status(404).json({ message: "Employee not found" });
		}
		return res.json(employee);
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};
const updateEmployee = async (req, res) => {
	try {
		const employee = await Employee.findByPk(req.query.id);
		if (!employee) {
			return res.status(404).json({ message: "Employee not found" });
		}
		await employee.update({
			LastName: req.body.lastName,
			MiddleName: req.body.middleName,
			FirstName: req.body.firstName,
			FullName: `${req.body.lastName} ${req.body.middleName} ${req.body.firstName}`,
			EmployeeCode: req.body.employeeCode,
			Email: req.body.email,
			Phone: req.body.phone,
			DateOfBirth: req.body.dateOfBirth,
			Gender: req.body.gender,
			EmployeeType: req.body.employeeType,
		});
		await LinkEmployeeDepartmentJob.update(
			{
				DepartmentId: req.body.departmentId,
				JobId: req.body.jobId,
			},
			{ where: { EmployeeId: req.query.id } }
		);
		return res.status(200).json({ message: "Employee updated successfully" });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

module.exports = {
	getEmployee,
};
