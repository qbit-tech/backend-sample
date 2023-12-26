'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    await queryInterface.createTable('banners', {
      bannerId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DataTypes.STRING
      },
      bannerType: {
        allowNull: true,
        type: Sequelize.STRING
      },
      bannerImageUrl: {
        allowNull: true,
        type: Sequelize.STRING
      },
      title: {
        allowNull: false,
        type: Sequelize.STRING
      },
      content: {
        allowNull: true,
        type: Sequelize.DataTypes.TEXT
      },
      subtitle: {
        allowNull: true,
        type: Sequelize.STRING
      },
      createdByUserId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      metaCreatedByUser: {
        allowNull: false,
        type: Sequelize.DataTypes.JSONB,
      },
      relatedContentType: {
        allowNull: true,
        type: Sequelize.STRING
      },
      relatedContentId: {
        allowNull: true,
        type: Sequelize.STRING
      },
      relatedContentUrl: {
        allowNull: true,
        type: Sequelize.STRING
      },
      isPublished: {
        allowNull: false,
        type: Sequelize.BOOLEAN
      },
      order: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      updatedAt: {
        type: Sequelize.DATE
      },
      createdAt: {
        type: Sequelize.DATE
      }
    });

  },

  async down (queryInterface, Sequelize) {

    await queryInterface.dropTable('banners');

  }
};


