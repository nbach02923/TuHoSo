const { AspNetUsers, NhanViens, Link_NhanVien_BoPhan_ChucVu } = require("../models");
const crypto = require("crypto");
const getUser = async (req, res) => {
	try {
		const attributes = { exclude: ["PasswordHash", "SecurityStamp"] };
		const user = req.query.id
			? await AspNetUsers.findByPk(req.query.id, { attributes })
			: await AspNetUsers.findAll({ attributes });
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.json(user);
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};
const createUser = async (req, res) => {
	const { userName, password } = req.body;
	try {
		const existingUser = await User.findOne({ where: { UserName: userName } });
		if (existingUser) {
			return res.status(409).json({ message: "User name already taken" });
		}
		const hashedPassword = "123"
		const id = crypto.randomUUID();
		await User.create({
			id: id,
			UserName: userName,
			Password: hashedPassword,
			SecretKey: crypto.randomUUID(),
			CreatedBy: id,
		});
		const employee = await Employee.create({ UserId: id, createdBy: id });
		await LinkEmployeeDepartmentJob.create({ EmployeeId: employee.id, CreatedBy: id });
		return res.status(201).json({ message: "User created successfully" });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};
const updateUser = async (req, res) => {
	try {
		const user = await User.findByPk(req.query.id, {
			attributes: ["id", "FullName", "EmployeeCode", "Email", "Phone", "IdNum"],
		});
		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}
		await user.update({
			FullName: req.body.fullName,
			EmployeeCode: req.body.employeeCode,
			Email: req.body.email,
			Phone: req.body.phone,
			IdNum: req.body.idNum,
		});
		return res.status(200).json({ message: "User updated successfully" });
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};
const deleteUser = async (req, res) => {
	try {
		const deletedCount = await User.destroy({ where: { id: req.query.id } });
		if (!deletedCount) {
			return res.status(404).json({ message: "User not found" });
		}
		return res.status(204);
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};

module.exports = {
	getUser,
};
