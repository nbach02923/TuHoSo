"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_NhanVien_BoPhan_ChucVu extends Model {}
	Link_NhanVien_BoPhan_ChucVu.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.INTEGER,
				unique: true,
			},
			NhanVienPkid: DataTypes.STRING,
			BoPhanPkid: DataTypes.STRING,
			ChucVuPkid: DataTypes.STRING,
			KiemNhiem: DataTypes.BOOLEAN,
			NgayBatDau: DataTypes.DATE,
			NgayKetThuc: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			isTruongBoPhan: DataTypes.BOOLEAN,
			unActivated: DataTypes.BOOLEAN,
			IdCongTy: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "Link_NhanVien_BoPhan_ChucVu",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return Link_NhanVien_BoPhan_ChucVu;
};
