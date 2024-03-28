const {
	AspNetUsers,
	FileDinhKems,
	ThuMucHoSoDuAns,
	ThuMucHoSoDuAnMaus,
	ThuMuc_File_Share,
	ThuMuc_Share,
	ThuVienThuMucMaus,
	ThuMucHoSoKhacs,
	Link_File_FolderShare_History,
	Link_File_FolderShare_HistoryDetail,
	Link_FolderTuHoSo_User,
	Link_FolderTuHoSo_Group,
	Link_FolderTuHoSo_PhongBan,
	Link_ThuVien_DuAn,
	sequelize,
} = require("../models");
const crypto = require("crypto");
const { QueryTypes, Op, literal } = require("sequelize");
const checkRole = require("./role.controller");
require("dotenv").config();

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
		if (parentId === "0") {
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
		if (!req.query.Id) {
			return res
				.status(200)
				.json({ Detail: "Please provide library you want to find", Error: 6, sError: "LoiCuPhap" });
		}
		const library = await ThuVienThuMucMaus.findByPk(req.query.Id);
		if (!library) return res.status(200).json({ Detail: "Không tồn tại thư viện", Error: 2 });
		const folder = await ThuMucHoSoDuAnMaus.findAll({
			where: { idThuVien: req.query.Id },
			order: [
				["CapDoFolder", "ASC"],
				["Position", "ASC"],
				["TenThuVien", "ASC"],
			],
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
		let libraries;
		if (keyword !== "") {
			libraries = await ThuVienThuMucMaus.findAll({
				where: {
					[Op.or]: [
						{
							TenThuVien: {
								[Op.like]: `%${keyword}%`,
							},
							MaThuVien: {
								[Op.like]: `%${keyword}%`,
							},
						},
					],
				},
				order: [
					["Created", "ASC"],
					["TenThuVien", "ASC"],
				],
			});
		} else {
			libraries = await ThuVienThuMucMaus.findAll({ order: [["Created", "ASC"]] });
		}
		const libraryIds = libraries.map((library) => library.Id);
		const duAnLinks = await Link_ThuVien_DuAn.findAll({
			where: {
				idThuVien: libraryIds,
			},
			attributes: ["idThuVien", "idDuAn", "LoaiThuMuc"],
		});
		const result = libraries.map((library) => {
			const listIdDuAn = duAnLinks.filter((link) => link.idThuVien === library.Id).map((link) => link.idDuAn);
			const listLoaiThuMuc = duAnLinks
				.filter((link) => link.idThuVien === library.Id)
				.map((link) => link.LoaiThuMuc);
			return {
				...library.toJSON(),
				listIdDuAn,
				listLoaiThuMuc,
			};
		});
		return res.json({ Detail: "Get library successfully", Error: 7, Value: result });
	} catch (e) {
		return res.status(200).json({ Message: e.message, StatusCode: 2, Detail: "Lỗi Server", sError: "LoiServer" });
	}
};

const createLibrary = async (req, res) => {
	try {
		// const checkAdmin = checkRole(req.user.Id, "QUANLYBIM", 3);
		// if (!checkAdmin) return res.status(403).json({ message: "Only admin allowed" });
		let library;
		if (req.body.Id && req.body.Id !== "") {
			library = await ThuVienThuMucMaus.findByPk(req.body.Id, { where: { isXoa: false } });
			if (!library) return res.status(200).json({ Error: 9, Detail: "Không tồn tại thư viện" });
			await library.update({
				MaThuVien: req.body.MaThuVien,
				TenThuVien: req.body.TenThuVien,
				GhiChu: req.body.GhiChu,
				Modified: Date.now(),
				ModifiedBy: req.user.Id,
			});
		} else {
			const existedLibrary = await ThuVienThuMucMaus.findOne({
				where: { MaThuVien: req.body.MaThuVien, isXoa: false },
			});
			if (existedLibrary) return res.status(200).json({ StatusCode: 1, Error: 1, Detail: "Trùng mã thư viện" });
			const Id = crypto.randomUUID();
			library = await ThuVienThuMucMaus.create({
				Id: Id,
				MaThuVien: req.body.MaThuVien,
				TenThuVien: req.body.TenThuVien,
				GhiChu: req.body.GhiChu,
				Created: Date.now(),
				CreatedBy: req.user.Id,
				Modified: Date.now(),
				ModifiedBy: req.user.Id,
			});
		}
		return res
			.status(200)
			.json({ Error: 4, sError: "CapNhatThanhCong", Detail: "Cập nhật thành công", Value: library });
	} catch (e) {
		return res.status(200).json({ Error: 6 });
	}
};

const deleteLibrary = async (req, res) => {
	try {
		// const checkAdmin = checkRole(req.userId.Id, "QUANLYBIM", 3);
		// if (!checkAdmin) return res.status(403).json({ message: "Only admin allow" });
		if (!req.query.Id)
			return res.status(200).json({ Detail: "Cannot process this request", Error: 6, sError: "LoiCuPhap" });
		const library = await ThuVienThuMucMaus.destroy({ where: { Id: req.query.Id } });
		if (!library) return res.status(200).json({ message: "Library not found" });
		await ThuMucHoSoDuAnMaus.destroy({ where: { idThuVien: req.query.Id } });
		return res.status(200).json({ Detail: "Library successfully deleted", Error: 4, Value: library });
	} catch (e) {
		return res.status(200).json({ Detail: e.message, Error: 9, sError: "LoiServer" });
	}
};

const createAndUpdateFolder = async (req, res) => {
	try {
		const library = await ThuVienThuMucMaus.findByPk(req.body.idThuVien);
		if (!library) return res.status(200).json({ Detail: "Cannot find library", Error: 9, sError: "LoiCuPhap" });
		if (req.body.Id) {
			const existingFolder = await ThuMucHoSoDuAnMaus.findByPk(req.body.Id);
			if (!existingFolder)
				return res.status(200).json({ Error: 9, Detail: "Folder not found", sError: "LoiCuPhap" });
			await existingFolder.update({
				MaFolder: req.body.MaFolder,
				TenFolder: req.body.TenFolder,
				Modified: Date.now(),
				ModifiedBy: req.user.Id,
			});
			return res.status(200).json({ Error: 4, Detail: "Cập nhật thành công", Value: existingFolder });
		} else {
			const parentLevel = await ThuMucHoSoDuAnMaus.findByPk(req.body.idFolderParent, {
				attributes: ["CapDoFolder"],
			});
			let folderWithSamePosition;
			if (req.body.idFolderParent === "") {
				folderWithSamePosition = await ThuMucHoSoDuAnMaus.findOne({
					where: { idThuVien: req.body.idThuVien, Position: req.body.Position },
				});
			} else {
				folderWithSamePosition = await ThuMucHoSoDuAnMaus.findOne({
					where: {
						Position: req.body.Position,
						idFolderParent: req.body.idFolderParent,
						idThuVien: req.body.idThuVien,
					},
				});
			}
			if (folderWithSamePosition) {
				const foldersToUpdate = await ThuMucHoSoDuAnMaus.findAll({
					where: {
						idThuVien: req.body.idThuVien,
						idFolderParent: req.body.idFolderParent,
						Position: {
							[Op.gte]: req.body.Position,
						},
					},
					order: [["Position", "ASC"]],
				});
				for (const folder of foldersToUpdate) {
					await folder.update({
						Position: folder.Position + 1,
					});
				}
			} else {
				const folderId = crypto.randomUUID();
				const folder = await ThuMucHoSoDuAnMaus.create({
					Id: folderId,
					MaFolder: req.body.MaFolder,
					TenFolder: req.body.TenFolder,
					CapDoFolder: parentLevel ? parentLevel.CapDoFolder + 1 : 1,
					idFolderParent: req.body.idFolderParent === "" ? "0" : req.body.idFolderParent,
					Position: req.body.Position,
					Created: Date.now(),
					CreatedBy: req.user.Id,
					Modified: Date.now(),
					ModifiedBy: req.user.Id,
					idFolderMau: 0,
					idThuVien: req.body.idThuVien,
				});
				return res.status(200).json({ Error: 4, Detail: "Cập nhật thành công", Value: folder });
			}
		}
	} catch (e) {
		return res.status(200).json({ Detail: e.message, Error: 9, Value: null, sError: "LoiServer" });
	}
};

const deleteChildFolder = async (childId) => {
	const childrenOfChild = await ThuMucHoSoDuAnMaus.findAll({ where: { idFolderParent: childId } });
	for (const child of childrenOfChild) {
		await deleteChildFolder(child.Id);
	}
	await ThuMucHoSoDuAnMaus.destroy({ where: { Id: childId } });
};

const deleteFolder = async (req, res) => {
	try {
		// const checkAdmin = checkRole(req.user.Id, "QUANLYBIM", 3);
		// if (!checkAdmin) return res.status(403).json({ message: "Only admin allowed" });
		const folder = await ThuMucHoSoDuAnMaus.findByPk(req.query.Id);
		if (!folder) return res.status(200).json({ Detail: "Folder not found", Error: 6, sError: "LoiCuPhap" });
		const childFolder = await ThuMucHoSoDuAnMaus.findAll({
			where: { CapDoFolder: { [Op.gt]: folder.CapDoFolder }, idFolderParent: folder.Id },
		});
		for (const child of childFolder) {
			await deleteChildFolder(child.Id);
		}
		let sameCapDoFolder;
		if (folder.CapDoFolder === 1) {
			sameCapDoFolder = await ThuMucHoSoDuAnMaus.findAll({
				where: {
					idThuVien: folder.idThuVien,
					CapDoFolder: folder.CapDoFolder,
					Position: { [Op.gt]: folder.Position },
				},
				attributes: ["Id"],
				raw: true,
			});
		} else {
			sameCapDoFolder = await ThuMucHoSoDuAnMaus.findAll({
				where: {
					CapDoFolder: folder.CapDoFolder,
					idFolderParent: folder.idFolderParent,
					Position: { [Op.gt]: folder.Position },
				},
				attributes: ["Id"],
				raw: true,
			});
		}
		if (sameCapDoFolder.length > 0) {
			for (const folder of sameCapDoFolder) {
				await folder.update({ Position: folder.Position - 1 });
			}
		}
		const deletedFolder = await ThuMucHoSoDuAnMaus.destroy({
			where: { Id: req.query.Id },
		});
		return res.status(200).json({
			Error: 4,
			Detail: "Xóa thành công",
			Value: deletedFolder,
		});
	} catch (e) {
		return res.status(200).json({
			Error: 9,
			Detail: e.message,
			sError: "LoiServer",
		});
	}
};

const shareDirectory = async (req, res) => {
	try {
		// const checkAdmin = checkRole(req.user.Id, "QUANLYBIM", 3);
		// if (!checkAdmin) return res.status(403).json({ message: "Only admin allowed" });
		let userfolderShare, groupFolderShare, departmentFolderShare;
		for (const shareToItem of req.body.ShareTo) {
			switch (req.body.Type) {
				case "user":
					const user = await AspNetUsers.findByPk(shareToItem.Id);
					if (!user) {
						console.error(`User with ID ${shareToItem.Id} not found`);
					} else {
						userfolderShare = await Link_FolderTuHoSo_User.create({
							Id: crypto.randomUUID(),
							idFolderTuHoSo: req.body.Id,
							idUser: shareToItem.Id,
							MaQuyen: shareToItem.MaQuyen,
							CreatedBy: req.user.Id,
							Created: new Date(),
							ModifiedBy: req.user.Id,
							Modified: new Date(),
						});
					}
					break;
				case "group":
					const group = await GroupShareTuHoSoes.findByPk(shareToItem.Id);
					if (!group) {
						console.error(`Group with ID ${shareToItem.Id} not found`);
					} else {
						groupFolderShare = await Link_FolderTuHoSo_Group.create({
							Id: crypto.randomUUID(),
							idFolderTuHoSo: req.body.Id,
							idGroupShareTuHoSo: shareToItem.Id,
							MaQuyen: shareToItem.MaQuyen,
							CreatedBy: req.user.Id,
							Created: new Date(),
							ModifiedBy: req.user.Id,
							Modified: new Date(),
						});
					}
					break;
				case "department":
					const department = await BoPhans.findByPk(shareToItem.Id);
					if (!department) {
						console.error(`Department with ID ${shareToItem.Id} not found`);
					} else {
						departmentFolderShare = await Link_FolderTuHoSo_PhongBan.create({
							Id: crypto.randomUUID(),
							idFolderTuHoSo: req.body.Id,
							idPhongBan: shareToItem.Id,
							MaQuyen: shareToItem.MaQuyen,
							CreatedBy: req.user.Id,
							Created: new Date(),
							ModifiedBy: req.user.Id,
							Modified: new Date(),
						});
					}
					break;
				default:
					return res.status(200).json({ Error: 6, Detail: "Loại không hợp lệ" });
			}
		}
		const history = await Link_File_FolderShare_History.create({
			Id: crypto.randomUUID(),
			idFolderTuHoSo: req.body.Id,
			CreatedBy: req.user.Id,
			Created: new Date(),
			ModifiedBy: req.user.Id,
			Modified: new Date(),
		});
		const historyDetails = [];
		for (const shareToItem of req.body.ShareTo) {
			const historyDetail = await Link_File_FolderShare_HistoryDetail.create({
				Id: crypto.randomUUID(),
				idFolder_History: history.Id,
				Loai: req.body.Type === "user" ? "User" : req.body.Type === "group" ? "NhomUser" : "PhongBan",
				idNhan: req.body.Type === "user" ? 0 : shareToItem.Id,
				MaQuyen: shareToItem.MaQuyen,
				Ten: req.user.TenNhanVien,
				UserIdNhan: req.body.Type === "user" ? shareToItem.Id : null,
				CreatedBy: req.user.Id,
				Created: new Date(),
				ModifiedBy: req.user.Id,
				Modified: new Date(),
			});
			historyDetails.push(historyDetail);
		}
		const historyData = history.toJSON();
		historyData.Detail = historyDetails;
		const value = {
			historyData,
			...(req.body.Type === "user" && { userfolderShare }),
			...(req.body.Type === "group" && { groupFolderShare }),
			...(req.body.Type === "department" && { departmentFolderShare }),
		};
		return res.status(200).json({ Detail: `Shared ${req.body.Type} successfully`, Error: 4, Value: value });
	} catch (e) {
		return res.status(200).json({ Error: 9, Detail: e.message, sError: "LoiServer" });
	}
};

const getSharedHistory = async (req, res) => {
	try {
		const historys = await Link_File_FolderShare_History.findAll({ where: { idFolderTuHoSo: req.body.Id } });
		const historyIds = historys.map((history) => history.Id);
		const historyDetails = await Link_File_FolderShare_HistoryDetail.findAll({
			where: {
				idFolder_History: historyIds,
			},
		});
		const result = historys.map((h) => {
			const details = historyDetails.find((hd) => hd.idFolder_History === h.Id);
			return {
				...h.toJSON(),
				Details: details,
			};
		});
		return res.status(200).json({ Error: 4, Value: result });
	} catch (e) {
		return res.status(200).json({ Error: 9, Detail: e.message, sError: "LoiServer" });
	}
};

const moveLeftChild = async (parentFolder) => {
	const childFolders = await ThuMucHoSoDuAnMaus.findAll({
		where: {
			idFolderParent: parentFolder.Id,
		},
		order: [["Position", "ASC"]],
	});
	for (const child of childFolders) {
		await child.update({
			CapDoFolder: child.CapDoFolder - 1,
		});
		await moveLeftChild(child);
	}
};

const moveRightChild = async (parentFolder) => {
	const childFolders = await ThuMucHoSoDuAnMaus.findAll({
		where: {
			idFolderParent: parentFolder.Id,
		},
		order: [["Position", "ASC"]],
	});
	for (const child of childFolders) {
		await child.update({
			CapDoFolder: child.CapDoFolder + 1,
		});
		await moveRightChild(child);
	}
};

const moveFolder = async (req, res) => {
	try {
		// const checkAdmin = checkRole(req.user.Id, "QUANLYBIM", 3);
		// if (!checkAdmin) return res.status(403).json({ message: "Only admin allowed" });
		const folder = await ThuMucHoSoDuAnMaus.findByPk(req.body.Id);
		if (!folder) return res.status(404).json({ message: "Folder not found" });
		switch (req.body.Action) {
			case "left":
				if (folder.CapDoFolder === 1) {
					return res.status(200).json({ Detail: "Cannot move left anymore", Error: 6, sError: "LoiCuPhap" });
				}
				const newCapDoFolderLeft = folder.CapDoFolder - 1;
				const newParentId = await ThuMucHoSoDuAnMaus.findOne({ where: { Id: folder.idFolderParent } });
				const countPositionMoveLeft = await ThuMucHoSoDuAnMaus.count({
					where: {
						CapDoFolder: newCapDoFolderLeft,
						idThuVien: folder.idThuVien,
					},
				});
				const moveBelowUp = await ThuMucHoSoDuAnMaus.findAll({
					where: {
						idFolderParent: folder.idFolderParent,
						Position: { [Op.gt]: folder.Position },
					},
				});
				for (const move of moveBelowUp) {
					await move.update({ Position: move.Position - 1 });
				}
				await moveLeftChild(folder);
				await folder.update({
					CapDoFolder: newCapDoFolderLeft,
					idFolderParent: newCapDoFolderLeft === 1 ? 0 : newParentId.Id,
					Position: countPositionMoveLeft + 1,
				});
				return res.status(200).json({ Detail: "Folder move left successfully", Error: 4, Value: folder });
			case "right":
				if (folder.Position === 1) {
					return res.status(200).json({ Detail: "Cannot move right anymore", Error: 6, sError: "LoiCuPhap" });
				}
				const newCapDoFolderRight = folder.CapDoFolder + 1;
				const aboveFolder = await ThuMucHoSoDuAnMaus.findOne({
					where: {
						CapDoFolder: folder.CapDoFolder,
						Position: folder.Position - 1,
						idThuVien: folder.idThuVien,
					},
				});
				const siblingFolders = await ThuMucHoSoDuAnMaus.findAll({
					where: {
						idThuVien: folder.idThuVien,
						CapDoFolder: folder.CapDoFolder,
						Position: { [Op.gt]: folder.Position },
					},
					order: [["Position", "ASC"]],
				});
				for (const sibling of siblingFolders) {
					await sibling.update({
						Position: sibling.Position - 1,
					});
				}
				const countChild = await ThuMucHoSoDuAnMaus.count({
					where: {
						idThuVien: folder.idThuVien,
						idFolderParent: aboveFolder.Id,
						CapDoFolder: aboveFolder.CapDoFolder + 1,
					},
				});
				await moveRightChild(folder);
				await folder.update({
					CapDoFolder: newCapDoFolderRight,
					idFolderParent: aboveFolder.Id,
					Position: countChild + 1,
				});
				return res.status(200).json({ Detail: "Folder move right successfully", Error: 4, Value: folder });
			case "up":
				if (folder.Position === 1) {
					return res.status(200).json({ Detail: "Can not move up anymore", Error: 9, sError: "LoiCuPhap" });
				}
				const folderPushDown = await ThuMucHoSoDuAnMaus.findOne({
					where: {
						idThuVien: folder.idThuVien,
						Position: folder.Position - 1,
						CapDoFolder: folder.CapDoFolder,
					},
				});
				await folderPushDown.update({ Position: parseInt(folder.Position) });
				await folder.update({ Position: parseInt(folder.Position) - 1 });
				return res
					.status(200)
					.json({ Detail: "Folder moved up successfully", Error: 4, Value: [folder, folderPushDown] });
			case "down":
				const countChildFolder = await ThuMucHoSoDuAnMaus.count({
					where: {
						idThuVien: folder.idThuVien,
						CapDoFolder: folder.CapDoFolder,
					},
				});
				if (countChildFolder === folder.Position) {
					return res.status(200).json({ Detail: "Can not move down anymore", Error: 6, sError: "LoiCuPhap" });
				}
				const folderPushUp = await ThuMucHoSoDuAnMaus.findOne({
					where: {
						idThuVien: folder.idThuVien,
						Position: folder.Position + 1,
						CapDoFolder: folder.CapDoFolder,
					},
				});
				await folderPushUp.update({ Position: parseInt(folder.Position) });
				await folder.update({ Position: parseInt(folder.Position) + 1 });
				return res
					.status(200)
					.json({ Detail: "Folder moved down successfully", Error: 4, Value: [folderPushUp, folder] });
			default:
				return res.status(200).json({ Error: 9, Detail: "Invalid action", sError: "LoiCuPhap" });
		}
	} catch (e) {
		return res.status(200).json({ Detail: e.message, Error: 9, sError: "LoiServer", Value: null });
	}
};

const createChildFolderProject = async (folderData, idDuAn, userId, type) => {
	const createdFolders = [];
	let lastIdRecord = await ThuMucHoSoDuAns.findOne({
		order: [["Id", "DESC"]],
		attributes: ["Id"],
		raw: true,
	});
	let lastId = lastIdRecord ? lastIdRecord.Id : 0;
	const getParentFolderId = async (folder, idDuAn) => {
		if (folder.idFolderParent === folder.Id) {
			return 0;
		} else {
			const parentFolder = folderData.find((f) => f.Id === folder.idFolderParent);
			const { TenFolder, idFolderParent } = parentFolder;
			const parent = await ThuMucHoSoDuAns.findOne({
				where: { TenFolder, idDuAn },
				attributes: ["Id"],
			});
			return parent ? parent.Id : 0;
		}
	};
	const createFolder = async (folder, parentFolderId = 0) => {
		lastId++;
		const newFolder = {
			Id: lastId,
			MaFolder: folder.MaFolder,
			TenFolder: folder.TenFolder,
			CapDoFolder: folder.CapDoFolder,
			ThuTu: folder.Position,
			Created: literal("CURRENT_TIMESTAMP"),
			CreatedBy: userId,
			Modified: literal("CURRENT_TIMESTAMP"),
			ModifiedBy: userId,
			idDuAn: idDuAn,
			LoaiThuMuc: type,
			idFolderRoot: "",
			idNguoiSoHuu: folder.CreatedBy,
			isXoa: 0,
		};
		const idFolderRoot = parentFolderId === 0 ? lastId : parentFolderId.split(";")[1];
		if (newFolder.CapDoFolder === 1) {
			newFolder.idFolderParent = 0;
			newFolder.idFolderParentAll = ";;";
		} else {
			newFolder.idFolderParent = parentFolderId;
			newFolder.idFolderParentAll = `;${parentFolderId};`;
		}
		const createdFolder = await ThuMucHoSoDuAns.create(newFolder);
		createdFolders.push(createdFolder);
		if (folder.children && folder.children.length > 0) {
			for (const childFolder of folder.children) {
				await createFolder(childFolder, createdFolder.id);
			}
		}
	};
	for (const folder of folderData) {
		await createFolder(folder);
	}
};

const applyToFolder = async (req, res) => {
	try {
		const ListId = req.body.listIdDuAn;
		const checkApply = await Link_ThuVien_DuAn.findAll({
			where: { idThuVien: req.body.idThuVien },
			attributes: ["idDuAn"],
			raw: true,
		});
		const ListType = req.body.listLoaiFolder;
		const library = await ThuVienThuMucMaus.findByPk(req.body.idThuVien);
		if (!library) {
			return res.status(200).json({ Detail: "Library not found", Error: 6, sError: "LoiCuPhap", Value: null });
		}
		const folder = await ThuMucHoSoDuAnMaus.findAll({
			where: { idThuVien: req.body.idThuVien },
			order: [["CapDoFolder", "ASC"]],
		});
		const folderData = buildFolderStructure(folder);
		const existingIds = checkApply.map((row) => row.idDuAn);
		const newIds = ListId.filter((id) => !existingIds.includes(id));
		const idsToDelete = existingIds.filter((id) => !ListId.includes(id));
		if (idsToDelete.length > 0) {
			await ThuMucHoSoDuAns.destroy({
				where: { idDuAn: idsToDelete },
			});
			await Link_ThuVien_DuAn.destroy({
				where: { idThuVien: req.body.idThuVien, idDuAn: idsToDelete },
			});
		}
		if (newIds.length > 0) {
			for (let i = 0; i < newIds.length; i++) {
				const id = newIds[i];
				const type = ListType[i];
				await Link_ThuVien_DuAn.create({
					Id: crypto.randomUUID(),
					idThuVien: req.body.idThuVien,
					idDuAn: id,
					LoaiThuMuc: type,
					Created: Date.now(),
					CreatedBy: req.user.Id,
					Modified: Date.now(),
					ModifiedBy: req.user.Id,
				});
				await createChildFolderProject(folderData, id, req.user.Id, type);
			}
		}
		return res.status(200).json({ Detail: "Library applied successfully", Error: 4, Value: null });
	} catch (e) {
		return res.status(200).json({ Detail: e.message, Error: 9, sError: "LoiServer", Value: null });
	}
};

const moveLeftChildProject = async (folder) => {
	const childFolders = await ThuMucHoSoDuAns.findAll({
		where: {
			idFolderParent: folder.Id,
			CapDoFolder: folder.CapDoFolder,
		},
	});
	for (const child of childFolders) {
		await child.update({
			CapDoFolder: child.CapDoFolder - 1,
		});
		await moveLeftChildProject(child);
	}
};

const moveRightChildProject = async (folder) => {
	const childFolders = await ThuMucHoSoDuAns.findAll({
		where: {
			idFolderParent: folder.Id,
			CapDoFolder: folder.CapDoFolder,
		},
	});
	for (const child of childFolders) {
		await child.update({
			CapDoFolder: child.CapDoFolder + 1,
		});
		await moveRightChildProject(child);
	}
};

const moveProjectFolder = async (req, res) => {
	try {
		// const checkAdmin = checkRole(req.user.Id, "QUANLYBIM", 3);
		// if (!checkAdmin) return res.status(403).json({ message: "Only admin allowed" });
		const folder = await ThuMucHoSoDuAns.findByPk(req.body.Id, { where: { isXoa: false } });
		if (!folder) {
			return res.status(404).json({ message: "Folder not found" });
		} else {
			switch (req.body.Action) {
				case "left":
					if (folder.CapDoFolder === 1) {
						return res
							.status(200)
							.json({ Detail: "Cannot move left anymore", Error: 9, sError: "LoiCuPhap" });
					}
					const newCapDoFolderLeft = folder.CapDoFolder - 1;
					const newParentIdMoveLeft = await ThuMucHoSoDuAns.findOne({
						where: { Id: folder.idFolderParent },
					});
					const countPositionMoveLeft = await ThuMucHoSoDuAns.count({
						where: {
							idFolderParent: newParentIdMoveLeft.idFolderParent,
						},
					});
					const moveBelowUp = await ThuMucHoSoDuAns.findAll({
						where: {
							idFolderParent: folder.idFolderParent,
							Id: { [Op.ne]: folder.idFolderParent },
							ThuTu: { [Op.lt]: folder.ThuTu },
						},
					});
					for (const move of moveBelowUp) {
						await move.update({ ThuTu: move.ThuTu - 1 });
					}
					// const newIdFolderParentAll = await getParentFolderIds(newParentIdMoveLeft.Id);
					await moveLeftChildProject(folder);
					await folder.update({
						CapDoFolder: newCapDoFolderLeft,
						idFolderParent: newParentIdMoveLeft.Id,
						ThuTu: countPositionMoveLeft + 1,
						// idFolderParentAll: newIdFolderParentAll,
					});
					return res.status(200).json({ Detail: "Folder move left successfully", Error: 4, Value: folder });
				case "right":
					if (folder.ThuTu === 1) {
						return res
							.status(200)
							.json({ Detail: "Cannot move right anymore", Error: 6, sError: "LoiCuPhap" });
					}
					const newCapDoFolderRight = folder.CapDoFolder + 1;
					const aboveFolder = await ThuMucHoSoDuAns.findOne({
						where: {
							CapDoFolder: folder.CapDoFolder,
							ThuTu: folder.idThuVien - 1,
							idThuVien: folder.idThuVien,
						},
					});
					const siblingFolders = await ThuMucHoSoDuAnMaus.findAll({
						where: {
							idDuAn: folder.idDuAn,
							idFolderParent: folder.idFolderParent,
							ThuTu: { [Op.gt]: folder.ThuTu },
						},
						order: [["ThuTu", "ASC"]],
					});
					for (const sibling of siblingFolders) {
						await sibling.update({
							ThuTu: sibling.ThuTu - 1,
						});
					}
					const countChild = await ThuMucHoSoDuAns.count({
						where: {
							idDuAn: folder.idDuAn,
							idFolderParent: aboveFolder.Id,
							CapDoFolder: aboveFolder.CapDoFolder + 1,
						},
					});
					await moveRightChildProject(folder);
					await folder.update({
						CapDoFolder: newCapDoFolderRight,
						idFolderParent: aboveFolder.Id,
						ThuTu: countChild + 1,
					});
					return res.status(200).json({ Detail: "Folder move right successfully", Error: 4, Value: folder });
				case "up":
					if (folder.ThuTu === 1) {
						return res
							.status(200)
							.json({ Detail: "Cannot move left anymore", Error: 6, sError: "LoiCuPhap" });
					}
					const folderPushDown = await ThuMucHoSoDuAns.findOne({
						where: {
							idDuAn: folder.idDuAn,
							ThuTu: folder.ThuTu - 1,
							CapDoFolder: folder.CapDoFolder,
						},
					});
					await folderPushDown.update({ ThuTu: folder.ThuTu });
					await folder.update({ ThuTu: folder.ThuTu - 1 });
					return res
						.status(200)
						.json({ Detail: "Folder moved up successfully", Error: 4, Value: [folder, folderPushDown] });
				case "down":
					const countChildFolder = await ThuMucHoSoDuAns.count({
						where: {
							idDuAn: folder.idDuAn,
							CapDoFolder: folder.CapDoFolder,
						},
					});
					if (countChildFolder === folder.ThuTu) {
						return res
							.status(200)
							.json({ Detail: "Cannot move down anymore", Error: 6, sError: "LoiCuPhap" });
					}
					const folderPushUp = await ThuMucHoSoDuAns.findOne({
						where: {
							idDuAn: folder.idDuAn,
							ThuTu: folder.ThuTu + 1,
							CapDoFolder: folder.CapDoFolder,
						},
					});
					await folderPushUp.update({ ThuTu: folder.ThuTu });
					await folder.update({ ThuTu: folder.ThuTu + 1 });
					return res
						.status(200)
						.json({ Detail: "Folder moved down successfully", Error: 4, Value: [folderPushUp, folder] });
				case "any":
					break;
				default:
					return res.status(200).json({ Error: 9, Detail: "Invalid action", sError: "LoiCuPhap" });
			}
		}
	} catch (e) {
		return res.status(200).json({ Detail: e.message, Error: 9, sError: "LoiServer", Value: null });
	}
};

module.exports = {
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
};
