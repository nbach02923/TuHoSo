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
		await queryInterface.addColumn("ThuMucHoSoDuAnMaus", "MaFolder", { type: Sequelize.STRING });
		await queryInterface.addColumn("ThuMucHoSoDuAnMaus", "Position", { type: Sequelize.INTEGER });
		await queryInterface.addColumn("ThuMucHoSoDuAnMaus", "idThuVien", { type: Sequelize.STRING });
	},

	async down(queryInterface, Sequelize) {
		/**
		 * Add reverting commands here.
		 *
		 * Example:
		 * await queryInterface.dropTable('users');
		 */
	},
};
