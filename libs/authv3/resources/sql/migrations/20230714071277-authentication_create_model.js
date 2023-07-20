'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => 
    await queryInterface.createTable('authentications', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      method: {
        type: Sequelize.ENUM(
          'username-password', 
          'email-password',
          'phone-otp',
          'google',
          'facebook'
          ),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isPasswordExpired: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      passwordExpiredAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false
      },
      isBlocked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        default: false
      },
      blockedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
    }),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('authentications'),
};
