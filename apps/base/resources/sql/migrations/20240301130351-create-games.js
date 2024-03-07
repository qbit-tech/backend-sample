'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('games', {
      // id: {
      //   allowNull: false,
      //   autoIncrement: true,
      //   primaryKey: true,
      //   type: Sequelize.INTEGER
      // },

      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },

      game_code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      max_gameplay_per_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      min_reward_per_gameplay_per_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      max_reward_per_gameplay_per_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      max_round_per_gameplay_per_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      expired_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE
      },
      
      createdAt: {
        type: Sequelize.DATE
      }

    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('games');
  }
};

// - ID → uuid
// - Game Code → random string & number (8 karakter)
// - Title → wajib ada
// - Description
//     - Boleh NULL
// - Max gameplay per user → berapa kali user boleh START main game yang sama
// - Min reward per gameplay per user → Hadiah minimal yang didapatkan user untuk setiap sesi game
//     - Min boleh sama dengan max
// - Max reward per gameplay per user → Hadiah maksimal yang didapatkan user untuk setiap sesi game
//     - Min boleh sama dengan max
// - Max round per gameplay per user → berapa kali user diharuskan melakukan scratch sebelum klaim
//     - Max round minimal 1
// - Expired At
//     - Boleh NULL
// - Status → Active / Inactive