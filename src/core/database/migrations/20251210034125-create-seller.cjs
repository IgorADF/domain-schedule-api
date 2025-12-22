"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("Sellers", [
			{
				field: "id",
				type: Sequelize.UUID,
				primaryKey: true,
				allowNull: false,
				unique: true,
			},
			{
				field: "email",
				type: Sequelize.STRING(50),
				unique: true,
				allowNull: false,
			},
			{
				field: "password",
				type: Sequelize.STRING(50),
				allowNull: false,
			},
			{
				field: "createdAt",
				type: Sequelize.DATE,
				allowNull: false,
			},
			{
				field: "updatedAt",
				type: Sequelize.DATE,
				allowNull: false,
			},
			{
				field: "deletedAt",
				type: Sequelize.DATE,
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("Sellers");
	},
};
