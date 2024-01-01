'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('trackme', {
      id: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      appName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      activityType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      activityType: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      eventKey: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payload: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      timestamp: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }),
  down: async (queryInterface, Sequelize) =>
    queryInterface.dropTable('trackme'),
};
