'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sponsors', 'imgUrl');
    await queryInterface.addColumn('sponsors', 'sponsorUrl', {
      allowNull: true,
      type: Sequelize.TEXT
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('sponsors', 'sponsorUrl');
    await queryInterface.addColumn('sponsors', 'imgUrl', {
      allowNull: true,
      type: Sequelize.TEXT
    });
  }
};
