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
		await queryInterface.createTable("ThuMucHoSoMaus", {
			Id: Sequelize.UUID,
			TenFolder: Sequelize.STRING,
			CapDoFolder: Sequelize.INTEGER,
			idFolderParent: Sequelize.UUID,
			Created: Sequelize.DATE,
			CreatedBy: Sequelize.STRING,
			Modified: Sequelize.DATE,
			ModifiedBy: Sequelize.STRING,
			idFolderMau: Sequelize.INTEGER,
			idThuVien: Sequelize.UUID,
		});
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
		await queryInterface.dropTable("ThuMucHoSoMaus");
	},
};
