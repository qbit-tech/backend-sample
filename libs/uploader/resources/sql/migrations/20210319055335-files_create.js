'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.createTable('files', {
    fileId: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    tableName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    tableId: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    filePath: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    fileLinkCache: {
      type: Sequelize.STRING,
    },
    fileCacheTimeout: {
      type: Sequelize.DATE,
    },
    metadata: {
      type: Sequelize.JSONB,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  }),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('files')
};
