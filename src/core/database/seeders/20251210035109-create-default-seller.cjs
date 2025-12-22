"use strict";

const { uuidv7 } = require("uuidv7");
const { hashSync } = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("Sellers", [
			{
				id: uuidv7(),
				email: "test@gmail.com",
				password: hashSync("123456"),
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDeletes("Sellers", [
			{
				email: "test@gmail.com",
			},
		]);
	},
};
