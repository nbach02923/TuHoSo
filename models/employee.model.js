"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class NhanViens extends Model {}
	NhanViens.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.INTEGER,
				unique: true,
			},
			UserPkid: DataTypes.UUIDV4,
			Ten: DataTypes.STRING,
			TenDem: DataTypes.STRING,
			Ho: DataTypes.STRING,
			DiaChiPkid: DataTypes.STRING,
			TenDayDu: DataTypes.STRING,
			MaNhaVien: DataTypes.STRING,
			Email: DataTypes.STRING,
			DienThoai: DataTypes.STRING,
			AnhUrl: DataTypes.STRING,
			NgaySinh: DataTypes.DATEONLY,
			GioiTinh: DataTypes.BOOLEAN,
			CreatedBy: DataTypes.UUIDV4,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.UUIDV4,
			Modified: DataTypes.DATE,
			idKhoiNhanVien: DataTypes.INTEGER,
			MaNhanVienSo: DataTypes.INTEGER,
			unActivated: DataTypes.BOOLEAN,
			isNhanVienDoiTac: DataTypes.BOOLEAN,
			MaLoaiNhanVien: DataTypes.STRING,
			SoMayLe: DataTypes.INTEGER,
			LinkAnhVanLamViec: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "NhanViens",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return NhanViens;
};
