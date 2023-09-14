'use strict';

const uuidv4 = require('uuid').v4;
const superAdminPermission = require('../../../../base/src/modules/permission/featureAndPermission/featureAndPermission.constant.ts').FEATURE_PERMISSIONS

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        roleId: uuidv4(),
        roleName: 'Super Admin',
        permissions: superAdminPermission,
        isActive: true,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};