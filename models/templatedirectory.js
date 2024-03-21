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
				type: DataTypes.UUID,
			},
			MaFolder: DataTypes.STRING,
			TenFolder: DataTypes.STRING,
			CapDoFolder: DataTypes.INTEGER,
			idFolderParent: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			Position: DataTypes.INTEGER,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			idFolderMau: DataTypes.INTEGER,
			idThuVien: DataTypes.UUID,
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
