"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addColumn("Sellers", "name", {
			type: Sequelize.STRING(50),
			allowNull: false,
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeColumn("Sellers", "name");
	},
};
