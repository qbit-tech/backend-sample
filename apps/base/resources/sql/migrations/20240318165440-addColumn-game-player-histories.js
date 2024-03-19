'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return Promise.all([
      queryInterface.addColumn('game_player_histories', 'currentRound', {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn('game_player_histories', 'roundHistories', {
        type: Sequelize.JSON,
        allowNull: true,
      }),
    ]);

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    return Promise.all([
      queryInterface.removeColumn('game_player_histories', 'currentRound'),
      queryInterface.removeColumn('game_player_histories', 'roundHistories'),
    ]);
  }
};
