"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class AspNetUsers extends Model {}
	AspNetUsers.init(
		{
			Id: {
				allowNull: false,
				unique: true,
				type: DataTypes.STRING,
				primaryKey: true,
			},
			UserName: DataTypes.STRING,
			PasswordHash: DataTypes.STRING,
			SecurityStamp: DataTypes.STRING,
			TenNhanVien: DataTypes.STRING,
			MaNhanVien: DataTypes.STRING,
			Email: DataTypes.STRING,
			DienThoai: DataTypes.STRING,
			LinkAnhDaiDien: DataTypes.STRING,
			CMND: DataTypes.BIGINT,
			IsLocked: DataTypes.BOOLEAN,
			CreatedBy: DataTypes.UUID,
			Created: DataTypes.DATEONLY,
			ModifiedBy: DataTypes.UUID,
			Modified: DataTypes.DATEONLY,
			LinkAnhBanLamViec: DataTypes.STRING,
			EmailConfirmed: DataTypes.BOOLEAN,
			PhoneNumber: DataTypes.STRING,
			PhoneNumberConfirmed: DataTypes.BOOLEAN,
			TwoFactorEnabled: DataTypes.BOOLEAN,
			LockoutEndDateUtc: DataTypes.DATE,
			LockoutEnabled: DataTypes.BOOLEAN,
			AccessFailedCount: DataTypes.INTEGER,
			isDuocSuDungApp: DataTypes.BOOLEAN,
			ValidateDuocSuDungApp: DataTypes.STRING,
			PasswordWiki_Hash: DataTypes.STRING,
			isEnableWiki: DataTypes.BOOLEAN,
			SoMayLe: DataTypes.STRING,
			IdKeyCloak: DataTypes.STRING,
		},
		{
			sequelize,
			modelName: "AspNetUsers",
			timestamps: false,
			freezeTableName: true,
			
		}
	);
	return AspNetUsers;
};
