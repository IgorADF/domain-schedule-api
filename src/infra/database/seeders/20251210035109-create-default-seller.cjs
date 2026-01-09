"use strict";

const { uuidv7 } = require("uuidv7");
const { hashSync } = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert("Sellers", [
			{
				id: uuidv7(),
				name: "Test Seller",
				email: "test@gmail.com",
				password: hashSync("123456"),
				creationDate: new Date(),
				updateDate: new Date(),
			},
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDeletes("Sellers", [
			{
				email: "test@gmail.com",
			},
		]);
	},
};
