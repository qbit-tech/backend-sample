'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('transaction_items', {
      transactionItemId: {
        type: Sequelize.STRING,
        primaryKey: true,
      },
      transactionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      productId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      metaProduct: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      unit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pricePerUnit: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
        default: 0,
      },
      discountPerUnit: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
        default: 0,
      },
      additionalFee: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
        default: 0,
      },
      includeTax: {
        type: Sequelize.DataTypes.BOOLEAN,
        allowNull: true,
        default: false,
      },
      totalFinalPrice: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false
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
    queryInterface.dropTable('transaction_items'),
};
