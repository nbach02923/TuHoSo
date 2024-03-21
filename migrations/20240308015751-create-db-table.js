"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		/**
		 * Add altering commands here.
		 *
		 * Example:
		 * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
		 */
		await queryInterface.createTable("ThuMuc_Share", {
			Id: {
				allowNull: false,
				primaryKey: true,
				unique: true,
				type: Sequelize.UUID,
			},
			IdItem: Sequelize.UUID,
			TenFolder: Sequelize.STRING,
			IdNguoiNhan: Sequelize.STRING,
			Quyen: Sequelize.STRING,
			IdChuSoHuu: Sequelize.STRING,
			Created: Sequelize.DATE,
			CreatedBy: Sequelize.STRING,
			Modified: Sequelize.DATE,
			ModifiedBy: Sequelize.STRING,
		});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.dropTable("ThuMuc_Share")
	},
};
