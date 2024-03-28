"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_ThuVien_DuAn extends Model {}
	Link_ThuVien_DuAn.init(
		{
			Id: {
				type: DataTypes.STRING,
				allowNull: false,
				primaryKey: true,
				unique: true,
			},
			idThuVien: DataTypes.STRING,
			idDuAn: DataTypes.INTEGER,
			LoaiThuMuc: DataTypes.STRING,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
		},
		{
			sequelize,
			timestamps: false,
			freezeTableName: true,
			modelName: "Link_ThuVien_DuAn",
		}
	);
	return Link_ThuVien_DuAn;
};
