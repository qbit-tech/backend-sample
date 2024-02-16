'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('q_article_tags', {
      id: {
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        type: Sequelize.DataTypes.INTEGER,
      },
      articleId: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      tagId: {
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
    queryInterface.dropTable('q_article_tags'),
};
