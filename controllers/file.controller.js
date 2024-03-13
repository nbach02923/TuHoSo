const uploadFileMiddleware = require("../middlewares/file.middleware");
const {
	FileDinhKems,
	ThuMucHoSoDuAns,
	ThuMucHoSoDuAnMaus,
	ThuMuc_File_Share,
	ThuVienDuAns,
	sequelize,
} = require("../models");
const path = require("path");
const fs = require("fs");
const { QueryTypes, Op, HasMany } = require("sequelize");
const checkRole = require("./role.controller");
require("dotenv").config();

const getItem = async (req, res) => {
	try {
		const folder = await ThuMucHoSoDuAns.findAll({ where: { isXoa: false } });
		const file = await FileDinhKems.findAll({ where: { isXoa: false } });
		return res.json({ folder, file });
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

// API below is not gonna use right now
const upload = async (req, res) => {
	try {
		await uploadFileMiddleware(req, res);
		if (req.file === undefined) {
			return res.status(400).json({ message: "Please provide a file" });
		}
		const linuxPath = path.posix.join(...__dirname.split(path.sep));
		const filePath = `${linuxPath}/${path.posix.join(...req.file.path.split(path.sep))}`;
		const folderPath = `${linuxPath}${req.file.destination.split(".")[1]}`;
		await AttachFile.create({
			id: parseInt(`2${Math.floor(100000 + Math.random() * 900000)}`),
			FileName: req.file.originalname,
			FileNameGUI: req.file.filename,
			Folder: folderPath,
			Path: filePath,
			Link: `${process.env.API_LINK}?filename=${Buffer.from(req.file.filename).toString(
				"base64"
			)}&path=${Buffer.from(filePath).toString("base64")}`,
			CreatedBy: req.user.id,
			OwnerId: req.user.id,
		});
		return res.status(200).json({ message: "File uploaded successfully" });
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const createFolder = async (req, res) => {
	try {
		const folder = await ProjectFileDirectory.findOne({
			where: { FolderName: req.body.folderName, IsDeleted: false },
		});
		if (folder) {
			return res.status(409).json({ message: "Folder already existed" });
		}
		await folder.create({
			FolderName: req.body.folderName,
			FolderLevel: req.body.folderLevel,
			ParentFolderId: req.body.parentFolderId,
			ProjectId: req.body.projectId,
			RootFolderId: req.body.rootFolderId,
			OwnerId: req.user.id,
			CreatedBy: req.user.id,
		});
		return res.status(200).json({ message: "Folder created successfully" });
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const deleteItem = async (req, res) => {
	try {
		const { id } = req.query;
		const file = await AttachFile.update({ IsDeleted: true }, { where: { id } });
		const folder = await ProjectFileDirectory.update({ IsDeleted: true }, { where: { id } });
		if (!file && !folder) return res.status(404).json({ message: "File or folder not found." });
		if (folder) {
			await AttachFile.update({ IsDeleted: true }, { where: { FolderId: id } });
		}
		return res.status(204);
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const recoverFileFolder = async (req, res) => {
	try {
		const { id } = req.query;
		const date = new Date(Date.now() - 30 * 24 * 1000 * 60 * 60).toDateString();
		const file = await AttachFile.update({ IsDeleted: false }, { where: { id, updatedAt: { [Op.lte]: date } } });
		const folder = await ProjectFileDirectory.update(
			{ IsDeleted: false },
			{ where: { id, updatedAt: { [Op.lte]: date } } }
		);
		if (!file && !folder) return res.status(404).json({ message: "File or folder not found." });
		if (folder) {
			await AttachFile.update({ IsDeleted: false }, { where: { FolderId: id } });
		}
		return res.status(204);
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const getBin = async (req, res) => {
	try {
		const date = new Date(Date.now() - 30 * 24 * 1000 * 60 * 60).toISOString().split("T")[0];
		const query = `
		SELECT *
		FROM "ProjectFileDirectory" folder
		LEFT JOIN "AttachFile" file 
			ON folder.id = file."FolderId" 
			AND file."IsDeleted" = true 
		WHERE folder."IsDeleted" = true 
			AND folder."IsPermanentDeleted" = false 
			AND folder."updatedAt" <= ${date}
		`;
		const fileFolder = await sequelize.query(query, { nest: true, type: QueryTypes.SELECT });
		return res.json(fileFolder);
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const permanentDeleteFileFolder = async (req, res) => {
	const { fileName, folderName } = req.query;
	if (!fileName && !folderName) return res.status(400).json({ message: "Please select file or folder to delete." });
	try {
		// Fake permanent delete, still keep in the storage and database
		const itemDelete = await (fileName ? AttachFile : ProjectFileDirectory).update(
			{ IsPermanentDeleted: true },
			{ where: { [fileName ? "FileName" : "FolderName"]: fileName || folderName, isDeleted: true } }
		);
		return itemDelete ? res.status(204) : res.status(404).json({ message: "File or folder is not found" });
		// Delete file and folder from database and file is delete from storage
		// const itemDelete = await (fileName ? AttachFile : ProjectFileDirectory).destroy({
		// 	where: { [fileName ? "FileName" : "FolderName"]: fileName || folderName, isDeleted: true },
		// });
		// fs.unlink(itemDelete.Path, (e) => {
		// 	if (e) return res.status(500).json({ message: e.message });
		// });
		// return itemDelete ? res.status(204) : res.status(404).json({ message: "File or folder is not found" });
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

// API for project library contain project folder template
const getLibrary = async (req, res) => {
	try {
		const query = `
		SELECT *
		FROM "ThuVienDuAns" l
		LEFT JOIN "ThuMucHoSoDuAnMaus" f ON l."Id" = f."idFolderMau"
		WHERE l."isXoa" = 0
		`;
		const library = await sequelize.query(query, { nest: true, type: QueryTypes.SELECT });
		// not yet test the codee below. This is the same query of above
		// const library = await ThuVienDuAns.findAll({
		// 	include: [
		// 		{
		// 			model: "ThuMucHoSoDuAnMaus",
		// 			association: new HasMany("ThuVienDuAns", "ThuMucHoSoDuAnMaus"),
		// 			on: {
		// 				"$ThuVienDuAns.Id$": { [Op.eq]: col("ThuMucHoSoDuAnMaus.idFolderMau") },
		// 			},
		// 		},
		// 	],
		// 	where: { isXoa: false },
		// });
		return res.json(library);
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const createLibrary = async (req, res) => {
	try {
		const library = await ThuVienDuAns.findOne({ where: { MaThuVien: req.body.maThuVien } });
		if (library) return res.status(409).json({ message: "Library already existed" });
		await ThuVienDuAns.create({
			MaThuVien: req.body.maThuVien,
			TenThuVien: req.body.tenThuVien,
			GhiChu: req.body.ghiChu,
			Created: Date.now(),
			CreatedBy: req.user.Id,
			Modified: Date.now(),
			ModifiedBy: req.user.Id,
		});
		return res.status(200).json({ message: "Library created successfully" });
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const updateLibrary = async (req, res) => {
	try {
		const checkAdmin = checkRole(req.user.Id, "QUANLYBIM", 3);
		if (checkAdmin) {
			if (!req.query.id) return res.status(400).json({ message: "Cannot process this request" });
			const library = await ThuVienDuAns.findByPk(req.query.id);
			if (!library) return res.status(404).json({ message: " Library not found" });
			await library.update({
				MaThuVien: req.body.maThuVien,
				TenThuVien: req.body.tenThuVien,
				GhiChu: req.body.ghiChu,
				Modified: Date.now(),
				ModifiedBy: req.user.Id,
			});
			return res.json({ message: "Library updated successfully" });
		}
		return res.status(403).json({ message: "Only admin allow" });
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const deleteLibrary = async (req, res) => {
	try {
		const checkAdmin = checkRole(req.userId.Id, "QUANLYBIM", 3);
		if (checkAdmin == true) {
			if (req.query.id) return res.status(400).json({ message: "Cannot process this request" });
			const library = await ThuVienDuAns.destroy(req.query.id);
			if (!library) return res.status(404).json({ message: "Library not found" });
			return res.status(204);
		}
		return res.status(403).json({ message: "Only admin allow" });
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const createDirectoryInLibrary = async (req, res) => {
	try {
		const library = await ThuVienDuAns.findByPk(req.query.id);
		if (!library) return res.status(404).json({ message: " Library not found" });
		const folder = await ThuMucHoSoDuAnMaus.create({
			TenFolder: req.body.tenFolder,
			CapDoFolder: req.body.idFolderParent ? req.body.capDoFolder + 1 : 1,
			idFolderParent: req.body.idFolderParent ? req.body.idFolderParent : null,
			Created: Date.now(),
			CreatedBy: req.user.Id,
			Modified: Date.now(),
			ModifiedBy: req.user.Id,
			idFolderMau: req.body.idFolderMau,
			idThuVien: req.query.id,
		});
		if (!req.body.idFolderParent) await folder.update({ idFolderParent: folder.Id });
		return res.status(201).json("Folder created successfully");
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const shareDirectory = async (req, res) => {
	try {
		const [file, folder] = await Promise.all([
			FileDinhKems.findByPk(req.body.idItem, { where: { isXoa: false } }),
			ThuMucHoSoDuAns.findByPk(req.body.idItem, { where: { isXoa: false } }),
		]);
		if (file) {
			await ThuMuc_File_Share.create({
				IdItem: req.body.idItem,
				TenFile: req.body.TenFile,
				IdNguoiNhan: req.body.idNguoiNhan,
				Quyen: req.body.quyen,
				IdChuSoHuu: req.body.idChuSoHuu,
				CreatedBy: req.user.Id,
				Created: Date.now(),
				ModifiedBy: req.user.Id,
				Modified: Date.now(),
			});
			return res.status(201).json({ message: "File shared successfully" });
		} else if (folder) {
			if (folder.idFolderRoot <= 0) {
				const fileFromFolder = await FileDinhKems.findAll({
					attributes: ["Id"],
					where: { isXoa: false, idThuMuc: folder.Id },
				});
				await ThuMuc_File_Share.bulkCreate(
					fileFromFolder.map((item) => ({
						IdItem: item.Id,
						TenFile: item.TenFile,
						IdNguoiNhan: req.body.idNguoiNhan,
						Quyen: req.body.quyen,
						IdChuSoHuu: req.body.idChuSoHuu,
						Folder: folder.Id,
						CreatedBy: req.user.Id,
						Created: Date.now(),
						ModifiedBy: req.user.Id,
						Modified: Date.now(),
					}))
				);
				return res.status(201).json({ message: "Folder shared successfully" });
			}
			const childFolder = await ThuMucHoSoDuAns.findAll({
				attributes: ["Id"],
				where: { isXoa: false, idFolderRoot: folder.Id, Id: { [Op.ne]: folder.Id } },
			});
			let fileFromChildFolder = [];
			for (const child of childFolder) {
				const filesFromChild = await FileDinhKems.findAll({
					attributes: ["Id"],
					where: { isXoa: false, idFolder: child.Id },
				});
				fileFromChildFolder = [...fileFromChildFolder, ...filesFromChild];
			}
			for (const item of fileFromChildFolder) {
				await ThuMuc_File_Share.create({
					IdItem: item.Id,
					TenFile: item.TenFile,
					IdNguoiNhan: req.body.idNguoiNhan,
					Quyen: req.body.quyen,
					IdChuSoHuu: req.body.idChuSoHuu,
					Folder: folder.Id,
					CreatedBy: req.user.Id,
					Created: Date.now(),
					ModifiedBy: req.user.Id,
					Modified: Date.now(),
				});
			}
			return res.status(201).json({ message: "Folder shared successfully" });
		} else {
			return res.status(422).json({ message: "There is some error in the request that server cannot process." });
		}
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

const getPersonalFolder = async (req, res) => {
	try {
		const myFolder = await ThuMucHoSoDuAns.findAll({ where: { idNguoiSoHuu: req.user.Id, isXoa: false } });
		const myFile = await FileDinhKems.findAll({ where: { CreatedBy: req.user.Id, isXoa: false } });
		const mySharedFile = await ThuMuc_File_Share.findAll({
			where: { IdNguoiNhan: req.user.Id, isXoa: false, Folder: null },
		});
		const sharedFileInFolderIds = await ThuMuc_File_Share.findAll({
			attributes: ["Folder"],
			where: { IdNguoiNhan: req.user.Id, isXoa: false, Folder: { [Op.ne]: null } },
		});
		const rootFolderIds = [...new Set(sharedFileInFolderIds.map((item) => item.Folder))];
		const mySharedFolder = await ThuMucHoSoDuAns.findAll({
			attributes: ["Id", "TenFolder"],
			where: { Id: { [Op.in]: rootFolderIds } },
		});
		const result = {
			myItem: [...myFolder, ...myFile],
			mySharedFolder,
			mySharedFile,
		};
		return res.json(result);
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};
// Unfinished
const moveFolder = async (req, res) => {
	try {
		const folder = await ThuMucHoSoDuAns.findOne(req.query.id);
		if (!folder) return res.status(404).json({ message: "Folder not found" });
		switch (req.query.action) {
			case "left":
				break;
			case "right":
				break;
			case "up":
				if (folder.CapDoFolder <= 1)
					return res.status(422).json({ message: "Can not move folder out of project" });
				const moveUpParentFolder = await ThuMucHoSoDuAns.findByPk(folder.idFolderParent, {
					attributes: ["idFolderParent"],
				});
				await folder.update({
					CapDoFolder: folder.CapDoFolder - 1,
					idFolderParent: moveUpParentFolder,
					Modified: Date.now(),
					ModifiedBy: req.user.Id,
				});
				return res.status(200).json({ message: "Folder move successfully" });
			case "down":
				const moveDownParentFolder = await ThuMucHoSoDuAns.findByPk(folder.idFolderParent, {
					attributes: ["idFolderParent"],
				});
				await folder.update({
					CapDoFolder: folder.CapDoFolder + 1,
					idFolderParent: moveDownParentFolder,
					Modified: Date.now(),
					ModifiedBy: req.user.Id,
				});
				return res.status(200).json({ message: "Folder move successfully" });
			default:
				return res.status(418).json("The action is not be able to be performed");
		}
	} catch (e) {
		return res.status(500).json({ message: e });
	}
};

module.exports = {
	getLibrary,
	createLibrary,
	getPersonalFolder,
	updateLibrary,
	deleteLibrary,
	shareDirectory,
};
