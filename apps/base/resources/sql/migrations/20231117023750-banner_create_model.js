'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('banner', {
      id:{
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
    await queryInterface.dropTable('banner')
  }
};
