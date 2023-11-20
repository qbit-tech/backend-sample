'use strict';

const { UUIDV4 } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('banners', {
      id:{
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      title:{
        type: Sequelize.STRING,
        allowNull: false
      },
      bannerImage:{
        type: Sequelize.STRING,
        allowNull: false
      },
      bannerLink:{
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt:{
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt:{
        type: Sequelize.DATE,
        allowNull: true,
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('banners')
  }
};
