'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('game_player_histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gameId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      playerId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gameplay: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rewardClaimedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      rewardClaimed_AllRounds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true,
      },
      totalRewardClaimed: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('game_player_histories');
  }
};