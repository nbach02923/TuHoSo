"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ThuMuc_File_Share extends Model {}
	ThuMuc_File_Share.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: DataTypes.INTEGER,
				autoIncrement: true,
			},
			IdItem: DataTypes.INTEGER,
			TenFile: DataTypes.STRING,
			IdNguoiNhan: DataTypes.STRING,
			Folder: DataTypes.STRING,
			Quyen: DataTypes.STRING,
			IdChuSoHuu: DataTypes.STRING,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "ThuMuc_File_Share",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return ThuMuc_File_Share;
};
