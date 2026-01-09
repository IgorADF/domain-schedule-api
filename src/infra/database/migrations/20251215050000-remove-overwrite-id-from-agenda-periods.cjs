"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.removeColumn("AgendaPeriods", "overwriteId");
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.addColumn("AgendaPeriods", "overwriteId", {
			type: Sequelize.UUID,
			allowNull: true,
			references: {
				key: "id",
				model: "OverwriteDay",
			},
			onUpdate: "CASCADE",
			onDelete: "CASCADE",
		});
	},
};
