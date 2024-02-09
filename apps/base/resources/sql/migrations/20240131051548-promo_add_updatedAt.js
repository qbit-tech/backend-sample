'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('promos', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Date.now(),
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('promos', 'updatedAt');
  },
};
