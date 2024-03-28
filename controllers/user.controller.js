const {
	AspNetUsers,
	NhanViens,
	Link_NhanVien_BoPhan_ChucVu,
	Link_FolderTuHoSo_User,
	BoPhans,
	ChucVus,
} = require("../models");
const { Op, Sequelize } = require("sequelize");
const crypto = require("crypto");
const getUser = async (req, res) => {
	try {
		if (req.body.BoPhanPkid) {
			return res
				.status(200)
				.json({ Detail: "Please provide department you want to find", Error: 6, sError: "LoiCuPhap" });
		}
		const link = await Link_NhanVien_BoPhan_ChucVu.findAll({
			where: {
				BoPhanPkid: req.body.BoPhanPkid,
			},
			attributes: ["NhanVienPkid", "ChucVuPkid"],
		});
		const nhanVienIds = link.map((item) => item.NhanVienPkid);
		const chucVuIds = link.map((item) => item.ChucVuPkid);
		const employee = await NhanViens.findAll({
			where: {
				Id: nhanVienIds,
			},
			attributes: ["UserPkid"],
		});
		const userIds = employee.map((item) => item.UserPkid);
		const user = await AspNetUsers.findAll({
			where: {
				Id: userIds,
			},
			attributes: ["Id", "TenNhanVien", "MaNhanVien"],
			order: [["TenNhanVien", "ASC"]],
		});
		const share = await Link_FolderTuHoSo_User.findAll({
			where: {
				idUser: userIds,
				idFolderTuHoSo: req.body.Id,
			},
		});
		const jobTitle = await ChucVus.findAll({
			where: {
				Id: chucVuIds,
			},
			attributes: ["TenChucVu"],
		});
		const result = user.map((u) => {
			const shareData = share.find((s) => s.idUser === u.Id);
			const jobTitleData = jobTitle.find((j) => j.Id === chucVuIds.find((id) => id === u.Id));
			return {
				Id: u.Id,
				TenNhanVien: u.TenNhanVien,
				MaNhanVien: u.MaNhanVien,
				TenChucVu: jobTitleData ? jobTitleData.TenChucVu : "",
				isShare: !!shareData,
				MaQuyen: shareData.MaQuyen,
			};
		});
		return res.json({ Detail: "Get user successfully", Error: 7, Value: result });
	} catch (e) {
		return res.status(200).json({ Detail: e.message, Error: 9, sError: "LoiServer" });
	}
};

const createUser = async (req, res) => {
	const { userName, password } = req.body;
	try {
		const existingUser = await User.findOne({ where: { UserName: userName } });
		if (existingUser) {
			return res.status(409).json({ message: "User name already taken" });
		}
		const hashedPassword = "123";
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
