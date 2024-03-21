"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
	class Link_Share_User_GroupUser extends Model {}
	Link_Share_User_GroupUser.init(
		{
			Id: {
				unique: true,
				primaryKey: true,
				type: DataTypes.UUID,
				allowNull: false,
			},
			idShareItem: DataTypes.STRING,
			idGroupUser: DataTypes.STRING,
			idUser: DataTypes.STRING,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
		},
		{
			sequelize,
			tableName: "Link_Share_User_GroupUser",
			freezeTableName: true,
			timestamps: false,
		}
	);
	return Link_Share_User_GroupUser;
};
