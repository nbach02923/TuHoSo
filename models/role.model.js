"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class RoleQuyens extends Model {}
	RoleQuyens.init(
		{
			Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				unique: true,
			},
			TenRole: DataTypes.STRING,
			GhiChu: DataTypes.STRING,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			IdChucVu: DataTypes.INTEGER,
		},
		{
			sequelize,
			timestamps: false,
			freezeTableName: true,
			modelName: "RoleQuyens",
		}
	);
	return RoleQuyens;
};
