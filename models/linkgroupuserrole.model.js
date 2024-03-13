"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_GroupUser_RoleQuyen extends Model {}
	Link_GroupUser_RoleQuyen.init(
		{
			Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				unique: true,
			},
			idGroupUser: DataTypes.INTEGER,
			idRoleQuyen: DataTypes.INTEGER,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
		},
		{
			sequelize,
			timestamps: false,
			freezeTableName: true,
			modelName: "Link_GroupUser_RoleQuyen",
		}
	);
	return Link_GroupUser_RoleQuyen;
};