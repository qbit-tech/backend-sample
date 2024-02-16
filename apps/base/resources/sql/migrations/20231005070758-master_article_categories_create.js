'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('q_master_article_categories', {
      categoryId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      status: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }),

  down: async (queryInterface, Sequelize) =>
    queryInterface.dropTable('q_master_article_categories'),
};
