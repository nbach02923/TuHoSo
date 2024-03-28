"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class GroupShareTuHoSoes extends Model {}
	GroupShareTuHoSoes.init(
		{
			Id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.STRING,
				unique: true,
			},
			Ten: DataTypes.STRING,
			CreatedBy: DataTypes.STRING,
			Created: DataTypes.DATE,
			ModifiedBy: DataTypes.STRING,
			Modified: DataTypes.DATE,
		},
		{
			sequelize,
			modelName: "GroupShareTuHoSoes",
			timestamps: false,
			freezeTableName: true,
		}
	);
	return GroupShareTuHoSoes;
};
