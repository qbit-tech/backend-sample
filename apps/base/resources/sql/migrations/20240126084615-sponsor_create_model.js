'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) =>
  queryInterface.createTable('sponsors',{
    sponsorId: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
    },
    sponsorName: {
      allowNull: false,
      type: Sequelize.STRING,
      unique: true,
    },
    imgUrl: {
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
  down: async (queryInterface, Sequelize) => queryInterface.dropTable('sponsors')
};
