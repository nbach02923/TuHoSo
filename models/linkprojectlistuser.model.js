"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_DanhSachDuAn_User extends Model {}
	Link_DanhSachDuAn_User.init(
		{
			Id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
				unique: true,
			},
			idDuAn: DataTypes.INTEGER,
			idUser: DataTypes.INTEGER,
            ViTriTrongDuAn: DataTypes.STRING,
            TableDuAn: DataTypes.STRING,
			Created: DataTypes.DATE,
			CreatedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
		},
		{
			sequelize,
			timestamps: false,
			freezeTableName: true,
			modelName: "Link_DanhSachDuAn_User",
		}
	);
	return Link_DanhSachDuAn_User;
};