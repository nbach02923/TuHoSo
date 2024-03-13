"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class FileDinhKems extends Model {}
	FileDinhKems.init(
		{
			Id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				unique: true,
				allowNull: false,
				autoIncrement: true,
			},
			TableName: DataTypes.STRING,
			idItem: DataTypes.INTEGER,
			FileName: DataTypes.STRING,
			FileNameGUI: DataTypes.STRING,
			Folder: DataTypes.STRING,
			Path: DataTypes.STRING,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Link: DataTypes.STRING,
			Flag: DataTypes.STRING,
			TieuDe: DataTypes.STRING,
			idFolder: DataTypes.INTEGER,
			idDuAn: DataTypes.INTEGER,
			idTinhChatCongViec: DataTypes.INTEGER,
			isDeleted: DataTypes.BOOLEAN,
			FlagDinhKem: DataTypes.STRING,
			idTaiLieuDuAnMau: DataTypes.INTEGER,
			TrangThaiTaiLieuCDE: DataTypes.STRING,
			MoTaFile: DataTypes.STRING,
			OTu: DataTypes.STRING,
			CapFile: DataTypes.STRING,
			MaCongViec: DataTypes.STRING,
			MaCauKien: DataTypes.STRING,
			idHieuChinh: DataTypes.INTEGER,
			idPhuHop: DataTypes.INTEGER,
			TenCongTy: DataTypes.STRING,
			TenTacGia: DataTypes.STRING,
			TenNguoiKy: DataTypes.STRING,
			NgayKyDuyet: DataTypes.DATE,
			NgayHieuLuc: DataTypes.DATE,
			IdItemstr: DataTypes.STRING,
			isXoa: DataTypes.BOOLEAN,
			GhiChu: DataTypes.STRING,
			LinkHTTP: DataTypes.STRING,
			IdNoiGuiNhan: DataTypes.INTEGER,
			TableId: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "FileDinhKems",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return FileDinhKems;
};
