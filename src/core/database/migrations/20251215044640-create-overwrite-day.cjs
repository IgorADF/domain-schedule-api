"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("OverwriteDay", [
			{
				field: "id",
				type: Sequelize.UUID,
				primaryKey: true,
				allowNull: false,
				unique: true,
			},
			{
				field: "agendaId",
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					key: "id",
					model: "AgendaConfigs",
				},
			},
			{
				field: "day",
				type: Sequelize.DATEONLY,
				allowNull: false,
			},
			{
				field: "cancelAllDay",
				type: Sequelize.BOOLEAN,
				allowNull: false,
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.dropTable("OverwriteDay");
	},
};
