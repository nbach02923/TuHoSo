"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class ThuMuc_Share extends Model {}
	ThuMuc_Share.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: DataTypes.UUID,
			},
			IdItem: DataTypes.UUID,
			TenFolder: DataTypes.STRING,
			IdNguoiNhan: DataTypes.STRING,
			Quyen: DataTypes.STRING,
			IdChuSoHuu: DataTypes.STRING,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "ThuMuc_Share",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return ThuMuc_Share;
};
