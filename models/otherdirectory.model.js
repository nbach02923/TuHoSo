"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ThuMucHoSoKhacs extends Model {}
	ThuMucHoSoKhacs.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: DataTypes.UUID,
			},
			TenFolder: DataTypes.STRING,
			CapDoFolder: DataTypes.INTEGER,
			idFolderParent: {
				type: DataTypes.INTEGER,
				defaultValue: 0,
			},
			positionInTree: DataTypes.INTEGER,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			idFolderMau: DataTypes.INTEGER,
			idThuVien: DataTypes.UUID,
		},
		{
			sequelize,
			modelName: "ThuMucHoSoKhacs",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return ThuMucHoSoKhacs;
};
