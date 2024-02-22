'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('q_articles', 'titleEn', {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('q_articles', 'subtitleEn', {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('q_articles', 'slugEn', {
      allowNull: true,
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('q_articles', 'bodyEn', {
      allowNull: true,
      type: Sequelize.STRING,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('q_articles', 'titleEn');
    await queryInterface.removeColumn('q_articles', 'subtitleEn');
    await queryInterface.removeColumn('q_articles', 'slugEn');
    await queryInterface.removeColumn('q_articles', 'bodyEn');
  }
};
