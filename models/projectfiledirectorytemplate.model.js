"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ThuMucHoSoDuAnMaus extends Model {}
	ThuMucHoSoDuAnMaus.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: DataTypes.INTEGER,
				autoIncrement: true,
			},
			TenFolder: DataTypes.STRING,
			CapDoFolder: DataTypes.INTEGER,
			idFolderParent: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			idFolderRoot: DataTypes.INTEGER,
			idThuVien: DataTypes.INTEGER,
		},
		{
			sequelize,
			modelName: "ThuMucHoSoDuAnMaus",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return ThuMucHoSoDuAnMaus;
};
