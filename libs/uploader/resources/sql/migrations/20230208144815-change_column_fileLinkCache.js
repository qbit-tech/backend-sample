'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('files', 'fileLinkCache', {
      type: Sequelize.TEXT,
    });
  },

  down: async (queryInterface, Sequelize) => {
    queryInterface.changeColumn('files', 'fileLinkCache', {
      type: Sequelize.STRING,
    });
  },
};
