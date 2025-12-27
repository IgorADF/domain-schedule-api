"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("AgendaDayOfWeek", [
			{
				field: "id",
				type: Sequelize.UUID,
				primaryKey: true,
				allowNull: false,
				unique: true,
			},
			{
				field: "agendaConfigId",
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					key: "id",
					model: "AgendaConfigs",
				},
			},
			{
				field: "dayOfWeek",
				type: Sequelize.INTEGER,
				allowNull: false,
			},
		]);
	},

	async down(queryInterface) {
		await queryInterface.dropTable("AgendaDayOfWeek");
	},
};
