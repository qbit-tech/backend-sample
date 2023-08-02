'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('files', 'filePath', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('files', 'filePath', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
