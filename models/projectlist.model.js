"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class DanhSachDuAns extends Model {}
	DanhSachDuAns.init(
		{
			Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				unique: true,
			},
			TenDuAn: DataTypes.STRING,
			MaDuAn: DataTypes.STRING,
			NgayBatDau: DataTypes.DATE,
			NgayKetThuc: DataTypes.DATE,
			TrangThai: DataTypes.STRING,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			idUserQuanLyDuAn: DataTypes.STRING,
			TongMucDauTu: DataTypes.STRING,
			GhiChu: DataTypes.STRING,
			MaCongVan: DataTypes.STRING,
			SoPhieu: DataTypes.INTEGER,
			IdTrangThai: DataTypes.INTEGER,
			MucDauTuDuKien: DataTypes.STRING,
			DiaChi: DataTypes.STRING,
			IdNhaCungUngSCM: DataTypes.INTEGER,
			TenTrangThai: DataTypes.STRING,
			TenNguoiTao: DataTypes.STRING,
			PhamVi: DataTypes.STRING,
			TenNhaCungUng: DataTypes.STRING,
			IdDanhMucTinh: DataTypes.INTEGER,
			MaVung: DataTypes.STRING,
			IddmChuDauTu: DataTypes.STRING,
			isKetThuc: DataTypes.BOOLEAN,
		},
		{
			sequelize,
			timestamps: false,
			freezeTableName: true,
			modelName: "DanhSachDuAns",
		}
	);
	return DanhSachDuAns;
};
