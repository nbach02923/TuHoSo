"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_FolderTuHoSo_PhongBan extends Model {}
	Link_FolderTuHoSo_PhongBan.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.STRING,
				unique: true,
			},
			idFolderTuHoSo: DataTypes.STRING,
			idPhongBan: DataTypes.STRING,
			MaQuyen: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Link_FolderTuHoSo_PhongBan",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return Link_FolderTuHoSo_PhongBan;
};