'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('promos', 'image');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.addColumn('promos', 'image', {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: '',
    });
  }
};
