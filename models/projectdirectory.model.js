"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ThuMucHoSoDuAns extends Model {}
	ThuMucHoSoDuAns.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.INTEGER,
				unique: true,
				autoIncrement: true,
			},
			TenFolder: DataTypes.STRING,
			CapDoFolder: DataTypes.INTEGER,
			idFolderParent: DataTypes.INTEGER,
			idDuAn: DataTypes.INTEGER,
			idFolderRoot: DataTypes.INTEGER,
			idNguoiSoHuu: DataTypes.STRING,
			positionInTree: DataTypes.INTEGER,
			isXoa: DataTypes.BOOLEAN,
			GhiChu: DataTypes.TEXT,
			CreatedBy: DataTypes.STRING,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "ThuMucHoSoDuAns",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return ThuMucHoSoDuAns;
};
