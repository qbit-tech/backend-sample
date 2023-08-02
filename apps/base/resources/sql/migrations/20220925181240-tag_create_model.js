'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('tags',{
      tagId: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      tagName: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }),
down: async (queryInterface, Sequelize) => queryInterface.dropTable('tags')
};
