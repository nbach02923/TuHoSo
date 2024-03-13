"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("Users", [
			{
				id: "0a4e9d2c-ad17-466a-874c-5afcaeb4f4a5",
				UserName: "admin",
				Password: "$2a$15$YQXwanE4YbU2i3IAkYk.Pe9WsRj6/20TnW/2HenVOvVlZSyhShOf2",
				IsLocked: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("Users", null, {});
	},
};
