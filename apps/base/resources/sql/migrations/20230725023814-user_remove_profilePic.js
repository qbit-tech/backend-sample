'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'profilePic');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'profilePic', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  }
};
