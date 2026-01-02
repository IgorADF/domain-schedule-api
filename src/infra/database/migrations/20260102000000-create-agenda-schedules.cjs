"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("AgendaSchedules", [
			{
				field: "id",
				type: Sequelize.UUID,
				primaryKey: true,
				allowNull: false,
				unique: true,
			},
			{
				field: "contactName",
				type: Sequelize.STRING(100),
				allowNull: false,
			},
			{
				field: "contactPhoneNumber",
				type: Sequelize.STRING(20),
				allowNull: false,
			},
			{
				field: "day",
				type: Sequelize.DATEONLY,
				allowNull: false,
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

		await queryInterface.addIndex("AgendaSchedules", ["day"]);
	},

	async down(queryInterface) {
		await queryInterface.dropTable("AgendaSchedules");
	},
};
