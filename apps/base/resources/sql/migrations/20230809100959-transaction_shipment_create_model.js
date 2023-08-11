'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('transaction_shipments', {
      transactionShipmentId: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courierVendor: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      courierService: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      shipToAdress: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      weightInGram: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
      volumeInCM: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
      waybill: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shipmentProgress: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      shipmentDetail: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      shipmentType: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shipmentDate: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      shipmentTime: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      jneResponse: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      lastJNEStatus: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      },
      cost: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
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
    queryInterface.dropTable('transaction_shipments'),
};
