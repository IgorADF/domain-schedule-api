"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		// Rename column in OverwriteDay table
		await queryInterface.renameColumn(
			"OverwriteDay",
			"agendaId",
			"agendaConfigId",
		);

		// Add overwriteDayId column to AgendaPeriods table
		await queryInterface.addColumn("AgendaPeriods", "overwriteDayId", {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				model: "OverwriteDay",
				key: "id",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});

		// Add index for better query performance
		await queryInterface.addIndex("AgendaPeriods", ["overwriteDayId"], {
			name: "AgendaPeriods_overwriteDayId_index",
		});

		// Change agendaDayOfWeekId to allow nulls
		await queryInterface.changeColumn("AgendaPeriods", "agendaDayOfWeekId", {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				key: "id",
				model: "AgendaDayOfWeek",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	},

	async down(queryInterface, Sequelize) {
		// Remove index
		await queryInterface.removeIndex(
			"AgendaPeriods",
			"AgendaPeriods_overwriteDayId_index",
		);

		// Remove overwriteDayId column from AgendaPeriods
		await queryInterface.removeColumn("AgendaPeriods", "overwriteDayId");

		// Rename column back in OverwriteDay table
		await queryInterface.renameColumn(
			"OverwriteDay",
			"agendaConfigId",
			"agendaId",
		);

		// Change agendaDayOfWeekId to not allow nulls
		await queryInterface.changeColumn("AgendaPeriods", "agendaDayOfWeekId", {
			type: Sequelize.UUID,
			allowNull: false,
			references: {
				key: "id",
				model: "AgendaDayOfWeek",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	},
};
