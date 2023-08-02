'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.createTable('users', {
      userId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstName: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
      },
      middleName: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
      },
      lastName: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
      },
      nickName: {
        allowNull: true,
        type: Sequelize.DataTypes.STRING,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      phone: {
        allowNull: true,
        type: Sequelize.STRING,
        unique: true,
      },
      birthdate: {
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      profilePic: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.DataTypes.STRING,
        default: 'active',
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
    }),

  down: async (queryInterface, Sequelize) => queryInterface.dropTable('users'),
};
