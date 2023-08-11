'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.createTable('transactions', {
      transactionId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      transactionCode: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      totalPrice: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
      totalAdminFee: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
        default: 0,
      },
      totalTax: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
        default: 0,
      },
      totalAdditionalFee: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
        default: 0,
      },
      totalDiscount: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: true,
        default: 0,
      },
      totalFinalPrice: {
        type: Sequelize.DataTypes.FLOAT,
        allowNull: false,
      },
      buyerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      buyerDetail: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      sellerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      sellerDetail: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      calculationDetails: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      transactionStatus: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      expiredAt: {
        type: Sequelize.DATE,
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
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.dropTable('transactions');
  },
};
