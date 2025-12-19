"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("AgendaEvents", [
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
        field: "type",
        type: Sequelize.ENUM(
          "new_schedule",
          "cancel_by_client",
          "cancel_by_user",
          "reschedule_by_user"
        ),
        allowNull: false,
      },
      {
        field: "description",
        type: Sequelize.STRING(500),
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
    await queryInterface.dropTable("AgendaEvents");
  },
};
