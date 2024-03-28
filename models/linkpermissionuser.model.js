"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_QuyenUser_FileDinhKem extends Model {}
	Link_QuyenUser_FileDinhKem.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.STRING,
				unique: true,
			},
			idFileDinhKem: DataTypes.STRING,
			idUser: DataTypes.STRING,
			MaQuyen: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Link_QuyenUser_FileDinhKem",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return Link_QuyenUser_FileDinhKem;
};
