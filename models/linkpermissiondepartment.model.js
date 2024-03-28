"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_QuyenPhongBan_FileDinhKem extends Model {}
	Link_QuyenPhongBan_FileDinhKem.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.STRING,
				unique: true,
			},
			idFileDinhKem: DataTypes.STRING,
			idPhongBan: DataTypes.STRING,
			MaQuyen: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Link_QuyenPhongBan_FileDinhKem",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return Link_QuyenPhongBan_FileDinhKem;
};
