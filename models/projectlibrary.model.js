"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ThuVienThuMucMaus extends Model {}
	ThuVienThuMucMaus.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: DataTypes.UUID,
			},
			MaThuVien: DataTypes.STRING,
			TenThuVien: DataTypes.STRING,
			GhiChu: DataTypes.STRING,
			isXoa: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "ThuVienThuMucMaus",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return ThuVienThuMucMaus;
};
