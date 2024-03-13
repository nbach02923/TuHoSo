"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class GroupUsers extends Model {}
	GroupUsers.init(
		{
			Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				unique: true,
			},
			TenNhom: DataTypes.STRING,
			GhiChu: DataTypes.STRING,
			MaNhom: DataTypes.STRING,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
		},
		{
			sequelize,
			timestamps: false,
			freezeTableName: true,
			modelName: "GroupUsers",
		}
	);
	return GroupUsers;
};
