"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("AgendaPeriods", [
			{
				field: "id",
				type: Sequelize.UUID,
				primaryKey: true,
				allowNull: false,
				unique: true,
			},
			{
				field: "agendaDayOfWeekId",
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					key: "id",
					model: "AgendaDayOfWeek",
				},
			},
			{
				field: "overwriteId",
				type: Sequelize.UUID,
				allowNull: true,
				references: {
					key: "id",
					model: "OverwriteDay",
				},
			},
			{
				field: "startTime",
				type: Sequelize.TIME,
				allowNull: false,
			},
			{
				field: "endTime",
				type: Sequelize.TIME,
				allowNull: false,
			},
			{
				field: "minutesOfService",
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			{
				field: "minutesOfInterval",
				type: Sequelize.INTEGER,
			},
			{
				field: "order",
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			{
				field: "creationDate",
				type: Sequelize.DATE,
				allowNull: false,
			},
			{
				field: "updateDate",
				type: Sequelize.DATE,
				allowNull: false,
			},
		]);
	},

	async down(queryInterface) {
		await queryInterface.dropTable("AgendaPeriods");
	},
};
