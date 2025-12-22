"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.addIndex("AgendaDayOfWeek", {
			fields: ["agendaConfigId", "dayOfWeek"],
			unique: true,
			name: "agenda_day_of_week_unique_index",
		});
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.removeIndex(
			"AgendaDayOfWeek",
			"agenda_day_of_week_unique_index",
		);
	},
};
