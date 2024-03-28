"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_File_FolderShare_History extends Model {}
	Link_File_FolderShare_History.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.STRING,
				unique: true,
			},
			idFolderTuHoSo: DataTypes.STRING,
			idFileTuHoSo: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Link_File_FolderShare_History",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return Link_File_FolderShare_History;
};
