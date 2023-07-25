'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('roles',{
      roleId: {
        allowNull: false,
        type: Sequelize.STRING,
        primaryKey: true,
      },
      roleName: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true,
      },
      roleDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      permissions: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    }),
down: async (queryInterface, Sequelize) => queryInterface.dropTable('roles')
};
