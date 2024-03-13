"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ChucVus extends Model {}
	ChucVus.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.INTEGER,
				unique: true,
			},
			TenChucVu: DataTypes.STRING,
			MaChucVu: DataTypes.STRING,
			LoaiChucVuPkid: DataTypes.INTEGER,
			isQuanLy: DataTypes.BOOLEAN,
			CreatedBy: DataTypes.UUIDV4,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.UUIDV4,
			Modified: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "ChucVus",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return ChucVus;
};
