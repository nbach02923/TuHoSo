const uploadFileMiddleware = require("../middlewares/file.middleware");
const verifyToken = require("../middlewares/auth.middleware");
const {
	AspNetUsers,
	FileDinhKems,
	ThuMucHoSoDuAns,
	ThuMucHoSoDuAnMaus,
	ThuMuc_File_Share,
	ThuMuc_Share,
	ThuVienThuMucMaus,
	ThuMucHoSoKhacs,
	sequelize,
} = require("../models");
const path = require("path");
const crypto = require("crypto");
const { QueryTypes, Op } = require("sequelize");
const checkRole = require("./role.controller");
require("dotenv").config();

const getItem = async (req, res) => {
	try {
		const folder = await ThuMucHoSoDuAns.findAll({ where: { isXoa: false } });
		const file = await FileDinhKems.findAll({ where: { isXoa: false } });
		return res.json({ folder, file });
	} catch (e) {
		return res.status(500).json(e);
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
			Id: parseInt(`2${Math.floor(100000 + Math.random() * 900000)}`),
			FileName: req.file.originalname,
			FileNameGUI: req.file.filename,
			Folder: folderPath,
			Path: filePath,
			Link: `${process.env.API_LINK}?filename=${Buffer.from(req.file.filename).toString(
				"base64"
			)}&path=${Buffer.from(filePath).toString("base64")}`,
			CreatedBy: req.user.Id,
			OwnerId: req.user.Id,
		});
		return res.status(200).json({ message: "File uploaded successfully" });
	} catch (e) {
		return res.status(500).json(e);
	}
};

// const createFolder = async (req, res) => {
// 	try {
// 		const folder = await ProjectFileDirectory.findOne({
// 			where: { FolderName: req.body.folderName, IsDeleted: false },
// 		});
// 		if (folder) {
// 			return res.status(409).json({ message: "Folder already existed" });
// 		}
// 		await folder.create({
// 			FolderName: req.body.folderName,
// 			FolderLevel: req.body.folderLevel,
// 			ParentFolderId: req.body.parentFolderId,
// 			ProjectId: req.body.projectId,
// 			RootFolderId: req.body.rootFolderId,
// 			OwnerId: req.user.Id,
// 			CreatedBy: req.user.Id,
// 		});
// 		return res.status(200).json({ message: "Folder created successfully" });
// 	} catch (e) {
// 		return res.status(500).json(e);
// 	}
// };

const deleteItem = async (req, res) => {
	try {
		const { Id } = req.query;
		const file = await AttachFile.update({ IsDeleted: true }, { where: { Id } });
		const folder = await ProjectFileDirectory.update({ IsDeleted: true }, { where: { Id } });
		if (!file && !folder) return res.status(404).json({ message: "File or folder not found." });
		if (folder) {
			await AttachFile.update({ IsDeleted: true }, { where: { FolderId: Id } });
		}
		return res.status(204);
	} catch (e) {
		return res.status(500).json(e);
	}
};

const recoverFileFolder = async (req, res) => {
	try {
		const { Id } = req.query;
		const date = new Date(Date.now() - 30 * 24 * 1000 * 60 * 60).toDateString();
		const file = await AttachFile.update({ IsDeleted: false }, { where: { Id, updatedAt: { [Op.lte]: date } } });
		const folder = await ProjectFileDirectory.update(
			{ IsDeleted: false },
			{ where: { Id, updatedAt: { [Op.lte]: date } } }
		);
		if (!file && !folder) return res.status(404).json({ message: "File or folder not found." });
		if (folder) {
			await AttachFile.update({ IsDeleted: false }, { where: { FolderId: Id } });
		}
		return res.status(204);
	} catch (e) {
		return res.status(500).json(e);
	}
};

const getBin = async (req, res) => {
	try {
		const date = new Date(Date.now() - 30 * 24 * 1000 * 60 * 60).toISOString().split("T")[0];
		const query = `
		SELECT *
		FROM "ProjectFileDirectory" folder
		LEFT JOIN "AttachFile" file 
			ON folder.Id = file."FolderId" 
			AND file."IsDeleted" = true 
		WHERE folder."IsDeleted" = true 
			AND folder."IsPermanentDeleted" = false 
			AND folder."updatedAt" <= ${date}
		`;
		const fileFolder = await sequelize.query(query, { nest: true, type: QueryTypes.SELECT });
		return res.json(fileFolder);
	} catch (e) {
		return res.status(500).json(e);
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
		return res.status(500).json(e);
	}
};

// API for project library contain project folder template

const buildFolderStructure = (folders) => {
	const folderMap = new Map();
	const rootFolders = [];
	for (const folder of folders) {
		folderMap.set(folder.Id, {
			...folder.toJSON(),
			children: [],
		});
	}
	for (const folder of folderMap.values()) {
		const parentId = folder.idFolderParent;
		if (parentId === folder.Id) {
			rootFolders.push(folder);
		} else {
			const parentFolder = folderMap.get(parentId);
			if (parentFolder) {
				parentFolder.children.push(folder);
			}
		}
	}
	rootFolders.sort((a, b) => a.Position - b.Position);
	for (const rootFolder of rootFolders) {
		rootFolder.children.sort((a, b) => a.Position - b.Position);
	}
	return rootFolders;
};

const getLibrary = async (req, res) => {
	try {
		const library = await ThuVienThuMucMaus.findByPk(req.query.Id);
		if (!library) return res.status(200).json({ Detail: "Không tồn tại thư viện", Error: 2 });
		const folder = await ThuMucHoSoDuAnMaus.findAll({
			where: { idThuVien: req.query.Id },
			order: [["CapDoFolder", "ASC"]],
		});
		const libraryData = library.toJSON();
		libraryData.folder = buildFolderStructure(folder);
		return res.json(libraryData);
	} catch (e) {
		return res.status(500).json(e);
	}
};

const getFilterLibrary = async (req, res) => {
	try {
		const keyword = req.body.Keyword;
		let result;
		if (keyword !== "") {
			result = await sequelize.query(
				`
			SELECT *
			FROM "ThuVienThuMucMaus" l
			WHERE l."TenThuVien" = :keyword OR l."MaThuVien" = :keyword
			ORDER BY l."Created" ASC
			`,
				{
					replacements: {
						keyword: keyword,
					},
				}
			);
		}
		result = await sequelize.query(
			`
			SELECT *
			FROM "ThuVienThuMucMaus" l
			ORDER BY "Created" ASC
			`,
			{ nest: true, type: QueryTypes.SELECT }
		);
		return res.json(result);
	} catch (e) {
		return res.status(200).json({ Message: e.message, StatusCode: 2, Detail: "Lỗi Server", sError: "LoiServer" });
	}
};

const createLibrary = async (req, res) => {
	try {
		// const checkAdmin = checkRole(req.user.Id, "QUANLYBIM", 3);
		// if (!checkAdmin) return res.status(403).json({ message: "Only admin allowed" });
		if (req.body.Id !== "") {
			const library = await ThuVienThuMucMaus.findByPk(req.body.Id, { Where: { isXoa: false } });
			if (!library) return res.status(200).json({ Error: 9 });
			await library.update({
				MaThuVien: req.body.MaThuVien,
				TenThuVien: req.body.TenThuVien,
				GhiChu: req.body.GhiChu,
				Modified: Date.now(),
				ModifiedBy: req.user.Id,
			});
			return res
				.status(200)
				.json({ Error: 4, sError: "CapNhatThanhCong", Detail: "Cập nhật thành công", Value: library.Id });
		}
		const existedLibrary = await ThuVienThuMucMaus.findOne({
			where: { MaThuVien: req.body.MaThuVien, isXoa: false },
		});
		if (existedLibrary) return res.status(200).json({ StatusCode: 1, Error: 1, Detail: "Trùng mã thư viện" });
		const Id = crypto.randomUUID();
		const library = await ThuVienThuMucMaus.create({
			Id: Id,
			MaThuVien: req.body.MaThuVien,
			TenThuVien: req.body.TenThuVien,
			GhiChu: req.body.GhiChu,
			Created: Date.now(),
			CreatedBy: req.user.Id,
			Modified: Date.now(),
			ModifiedBy: req.user.Id,
		});
		return res
			.status(200)
			.json({ Error: 4, sError: "CapNhatThanhCong", Detail: "Cập nhật thành công", Value: library.Id });
	} catch (e) {
		return res.status(200).json({ Error: 6 });
	}
};

const deleteLibrary = async (req, res) => {
	try {
		const checkAdmin = checkRole(req.userId.Id, "QUANLYBIM", 3);
		if (checkAdmin == true) {
			if (req.query.Id) return res.status(200).json({ message: "Cannot process this request" });
			const library = await ThuVienThuMucMaus.update({ IsXoa: true }, { where: { Id: req.query.Id } });
			if (!library) return res.status(200).json({ message: "Library not found" });
			return res.status(200);
		}
		return res.status(403).json({ message: "Only admin allow" });
	} catch (e) {
		return res.status(500).json(e);
	}
};

const createAndUpdateFolder = async (req, res) => {
	try {
		const library = await ThuVienThuMucMaus.findByPk(req.body.idThuVien);
		if (!library) return res.status(200).json({ Detail: "" });
		if (req.body.Id) {
			await ThuMucHoSoDuAnMaus.update(
				{
					MaFolder: req.body.MaFolder,
					TenFolder: req.body.TenFolder,
					Modified: Date.now(),
					ModifiedBy: req.user.Id,
				},
				{ where: { Id: req.body.Id } }
			);
		}
		const parentLevel = await ThuMucHoSoDuAnMaus.findByPk(req.body.idFolderParent, { attributes: ["CapDoFolder"] });
		const folderId = crypto.randomUUID();
		const folder = await ThuMucHoSoDuAnMaus.create({
			Id: folderId,
			MaFolder: req.body.MaFolder,
			TenFolder: req.body.TenFolder,
			CapDoFolder: parentLevel ? parentLevel.CapDoFolder + 1 : 1,
			idFolderParent: req.body.idFolderParent === "" ? folderId : req.body.idFolderParent,
			Position: req.body.Position,
			Created: Date.now(),
			CreatedBy: req.user.Id,
			Modified: Date.now(),
			ModifiedBy: req.user.Id,
			idFolderMau: 0,
			idThuVien: req.body.idThuVien,
		});
		return res.status(201).json({ Error: 4, Detail: "Cập nhật thành công", Value: folder });
	} catch (e) {
		return res.status(200).json({ Detail: e.message, Error: 9, Value: null, sError: "LoiServer" });
	}
};

const deleteFolder = async (req, res) => {
	try {
		const library = await ThuMucHoSoDuAnMaus.destroy(req.query.Id);
		if (!library) return res.status(200).json({ Error: 9 });
		return res.status(200).json({ Errro: 4, Detail: "Xóa thành công" });
	} catch (e) {
		return res.status(200).json({ Error: 9, Detail: e.message });
	}
};

const shareDirectory = async (req, res) => {
	try {
		// const checkAdmin = checkRole(req.user.Id, "QUANLYBIM", 3);
		// if (!checkAdmin) return res.status(403).json({ message: "Only admin allowed" });
		switch (req.body.Type) {
			case "user":
				break;

			default:
				break;
		}
	} catch (e) {
		return res.status(500).json(e);
	}
};

const getPersonalFolder = async (req, res) => {
	try {
		const user = await AspNetUsers.findByPk(req.user.Id);
		if (!user) return res.status(404).json({ message: "User not found" });
		const [myFolder, myFile] = await Promise.all([
			ThuMucHoSoDuAns.findAll({ where: { idNguoiSoHuu: req.user.Id, isXoa: 0 } }),
			FileDinhKems.findAll({ where: { CreatedBy: req.user.Id, isXoa: 0 } }),
		]);
		// const sharedFileInFolderIds = await ThuMuc_File_Share.findAll({
		// 	attributes: ["Folder"],
		// 	where: { IdNguoiNhan: req.user.Id, isXoa: false, Folder: { [Op.ne]: null } },
		// });
		// const rootFolderIds = [...new Set(sharedFileInFolderIds.map((item) => item.Folder))];
		// const mySharedFolder = await ThuMucHoSoDuAns.findAll({
		// 	attributes: ["Id", "TenFolder"],
		// 	where: { Id: { [Op.in]: rootFolderIds } },
		// });
		const [shareWithMeFolder, shareWithMeFile] = await Promise.all([
			ThuMuc_File_Share.findAll({
				where: { IdNguoiNhan: req.user.Id },
				order: [["Modified", "DESC"]],
			}),
			ThuMuc_Share.findAll({
				where: { idNguoiNhan: req.user.Id },
				order: [["Modified", "DESC"]],
			}),
		]);
		const [shareByMeFolder, shareByMeFile] = await Promise.all([
			ThuMuc_File_Share.findAll({
				where: { IdChuSoHuu: req.user.Id },
				order: [["Modified", "DESC"]],
			}),
			ThuMuc_Share.findAll({
				where: { IdChuSoHuu: req.user.Id },
				order: [["Modified", "DESC"]],
			}),
		]);
		const result = {
			myItem: [...myFolder, ...myFile],
			sharedWithMe: [...shareWithMeFolder, ...shareWithMeFile],
			sharedByMe: [...shareByMeFolder, ...shareByMeFile],
		};
		return res.json(result);
	} catch (e) {
		return res.status(500).json({ message: e.message });
	}
};
// Unfinished
const moveFolder = async (req, res) => {
	try {
		// const checkAdmin = checkRole(req.user.Id, "QUANLYBIM", 3);
		// if (!checkAdmin) return res.status(403).json({ message: "Only admin allowed" });
		const folder = await ThuMucHoSoDuAnMaus.findOne(req.body.Id);
		if (!folder) return res.status(404).json({ message: "Folder not found" });
		switch (req.body.Action) {
			case "left":
				if (folder.CapDoFolder <= 1)
					return res.status(200).json({ Error: 9, Detail: "Can not move left anymore", sError: "LoiCuPhap" });
				folder.update({
					CapDoFolder: folder.CapDoFolder - 1,
					idFolderParent: await ThuMucHoSoDuAnMaus.findByPk(folder.idFolderParent, { attributes: ["Id"] }),
				});
				const childrenMoveLeft = await ThuMucHoSoDuAnMaus.findAll({
					where: { idFolderParent: folder.Id },
					attributes: ["Id"],
				});
				for (const child of childrenMoveLeft) {
					await ThuMucHoSoDuAnMaus.update(
						{ CapDoFolder: child.CapDoFolder - 1 },
						{ where: { Id: child.Id } }
					);
				}
				return res.status(200).json({ Detail: "Folder move left successfully", Error: 4 });
			case "right":
				if (folder.Position === 1)
					return res
						.status(200)
						.json({ Detail: "Can not move right anymore", sError: "LoiCuPhap", Error: 9 });
				folder.update({
					CapDoFolder: folder.CapDoFolder + 1,
					idFolderParent: await ThuMucHoSoDuAnMaus.findOne({
						where: { idFolderParent: folder.idFolderParent, Position: folder.Position - 1 },
					}),
				});
				return res.status(200).json({ Detail: "Folder move right successfully", Error: 4 });
			case "up":
				if (folder.Position === 1)
					return res.status(200).json({ Detail: "Can not move up anymore", Error: 9, sError: "LoiCuPhap" });
				folder.update({ Position: folder.Position - 1 });
				await ThuMucHoSoDuAnMaus.update(
					{ Position: folder.Position + 1 },
					{ where: { idFolderParent: folder.idFolderParent, Position: folder.Position } }
				);
				return res.status(200).json({ Detail: "Folder moved up successfully", Error: 4 });
			case "down":
				const countChildFolder = await ThuMucHoSoDuAnMaus.count({
					where: { idFolderParent: folder.idFolderParent },
				});
				if (folder.Position === countChildFolder)
					return res.status(200).json({ Error: 9, Detail: "Can not move down anymore", sError: "LoiCuPhap" });
				folder.update({ Position: folder.Position + 1 });
				await ThuMucHoSoDuAnMaus.update(
					{ Position: folder.Position - 1 },
					{ where: { idFolderParent: folder.idFolderParent, Position: folder.Position } }
				);
				return res.status(200).json({ Detail: "Folder moved up successfully", Error: 4 });
			default:
				return res.status(200).json({ Error: 9, Detail: "Invalid action", sError: "LoiCuPhap" });
		}
	} catch (e) {
		return res.status(200).json({ Detail: e.message, Error: 9, sError: "LoiServer", Value: null });
	}
};

//Mobile API
const getFile = async (req, res) => {
	try {
		const tasksQuery = `
		SELECT *
		FROM "FileDinhKems" f
		INNER JOIN ""
		`;
	} catch (e) {
		return res.status(500).json(e);
	}
};

module.exports = {
	getLibrary,
	createLibrary,
	getPersonalFolder,
	deleteLibrary,
	shareDirectory,
	getFilterLibrary,
	createAndUpdateFolder,
	deleteFolder,
	moveFolder,
};
