"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_File_FolderShare_HistoryDetail extends Model {}
	Link_File_FolderShare_HistoryDetail.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.STRING,
				unique: true,
			},
			idFolder_History: DataTypes.STRING,
			Loai: DataTypes.STRING,
			idNhan: DataTypes.INTEGER,
			MaQuyen: DataTypes.STRING,
			Ten: DataTypes.STRING,
			UserIdNhan: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			Flag: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "Link_File_FolderShare_HistoryDetail",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return Link_File_FolderShare_HistoryDetail;
};
