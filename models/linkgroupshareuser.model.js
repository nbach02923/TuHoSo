"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Link_GroupShareTuHoSo_User extends Model {}
	Link_GroupShareTuHoSo_User.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.STRING,
				unique: true,
			},
			idGroupShareTuHoSo: DataTypes.STRING,
            idUser: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "Link_GroupShareTuHoSo_User",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return Link_GroupShareTuHoSo_User;
};
