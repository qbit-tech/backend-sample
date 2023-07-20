'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('tags', 'status', {
      allowNull: true,
      type: Sequelize.STRING(8),
      default: 'active',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('tags', 'status');
  },
};
