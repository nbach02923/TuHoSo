"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_User_GroupUser extends Model {}
	Link_User_GroupUser.init(
		{
			Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				unique: true,
			},
			isUser: DataTypes.STRING,
			idGroupUser: DataTypes.INTEGER,
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
			modelName: "Link_User_GroupUser",
		}
	);
	return Link_User_GroupUser;
};