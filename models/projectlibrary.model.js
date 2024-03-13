"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ThuVienDuAns extends Model {}
	ThuVienDuAns.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: DataTypes.INTEGER,
				autoIncrement: true,
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
			modelName: "ThuVienDuAns",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return ThuVienDuAns;
};
