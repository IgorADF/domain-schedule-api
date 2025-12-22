"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("AgendaConfigs", [
			{
				field: "id",
				type: Sequelize.UUID,
				primaryKey: true,
				allowNull: false,
				unique: true,
			},
			{
				field: "sellerId",
				type: Sequelize.UUID,
				allowNull: false,
				unique: true,
				references: {
					key: "id",
					model: "Sellers",
				},
			},
			{
				field: "maxDaysOfAdvancedNotice",
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			{
				field: "minHoursOfAdvancedNotice",
				type: Sequelize.INTEGER,
			},
			{
				field: "timezone",
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
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("AgendaConfigs");
	},
};
