'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query(`
      create index files_table_id on files (("tableName"), ("tableId"))
    `),
  ]),

  down: async (queryInterface, Sequelize) => Promise.all([
    queryInterface.sequelize.query(`
      drop index files_table_id
    `),
  ])
};
