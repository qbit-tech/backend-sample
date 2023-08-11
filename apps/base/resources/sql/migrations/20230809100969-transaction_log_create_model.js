'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('transaction_logs', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.INTEGER,
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dataBefore: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      dataAfter: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      note: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('transaction_logs');
  },
};
