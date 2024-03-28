"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_QuyenGroup_FileDinhKem extends Model {}
	Link_QuyenGroup_FileDinhKem.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.STRING,
				unique: true,
			},
			idFileDinhKem: DataTypes.STRING,
			idGroupShareTuHoSo: DataTypes.STRING,
			MaQuyen: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Link_QuyenGroup_FileDinhKem",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return Link_QuyenGroup_FileDinhKem;
};
