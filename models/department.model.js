"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class BoPhans extends Model {}
	BoPhans.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.INTEGER,
				unique: true,
			},
			TenBoPhan: DataTypes.STRING,
			MaBoPhan: DataTypes.STRING,
			DienThoai: DataTypes.STRING,
			Fax: DataTypes.STRING,
			Email: DataTypes.STRING,
			LoaiBoPhanPkid: DataTypes.STRING,
			BoPhanChaPkid: DataTypes.STRING,
			TrangThai: DataTypes.TINYINT,
			CreatedBy: DataTypes.UUIDV4,
			Created: DataTypes.DATEONLY,
			ModifiedBy: DataTypes.UUIDV4,
			Modified: DataTypes.DATE,
			idNguoiPhuTrach: DataTypes.STRING,
			idNguoiQuanLyTrucTiep: DataTypes.STRING,
			Order: DataTypes.INTEGER,
			idDuAn: DataTypes.INTEGER,
			TenVietTat: DataTypes.STRING,
			MaIPOSKeToan: DataTypes.STRING,
			isDoiTac: DataTypes.BOOLEAN,
			IdKhachHang: DataTypes.INTEGER,
			DiaChi: DataTypes.STRING,
			MaSoThue: DataTypes.STRING,
			SoNgayLamViec: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "BoPhans",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return BoPhans;
};
