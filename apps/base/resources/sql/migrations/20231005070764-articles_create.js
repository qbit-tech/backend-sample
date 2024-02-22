'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('q_articles', {
      articleId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.STRING,
      },
      title: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      subtitle: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
      },
      titleEn: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
      },
      subtitleEn: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
      },
      slug: {
        allowNull: false,
        unique: true,
        type: Sequelize.DataTypes.STRING,
      },
      slugEn: {
        allowNull: true,
        unique: true,
        type: Sequelize.DataTypes.STRING,
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      body: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT('long'),
      },
      bodyEn: {
        allowNull: false,
        type: Sequelize.DataTypes.TEXT('long'),
      },
      status: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      isHighlight: {
        allowNull: false,
        type: Sequelize.DataTypes.BOOLEAN,
      },
      metaCreatedByUser: {
        allowNull: false,
        type: Sequelize.DataTypes.JSON,
      },
      createdByUserId: {
        allowNull: false,
        type: Sequelize.DataTypes.STRING,
      },
      publicationAt: {
        allowNull: false,
        type: Sequelize.DataTypes.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
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
    queryInterface.dropTable('q_articles'),
};
