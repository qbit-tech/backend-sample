'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.createTable('promos', {
      promoId: {
        allowNull: false,
        primaryKey: true,
        type:  Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isPublish: {
        type: Sequelize.BOOLEAN,
        allowNull: true
      },
      startedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endedAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
    })
  },

  async down (queryInterface, Sequelize) {
    queryInterface.dropTable('promos')
  }
};
