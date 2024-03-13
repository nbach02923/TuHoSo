"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_User_RoleQuyen extends Model {}
	Link_User_RoleQuyen.init(
		{
			Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				unique: true,
			},
			idUser: DataTypes.STRING,
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
			modelName: "Link_User_RoleQuyen",
		}
	);
	return Link_User_RoleQuyen;
};
