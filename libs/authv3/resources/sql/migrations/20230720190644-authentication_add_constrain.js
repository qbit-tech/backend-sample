'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => 
      queryInterface.addConstraint('authentications', {
      fields: ['userId', 'method'],
      type: 'unique',
      name: 'authentication_unique_constraint'
    }),
  

  down: async (queryInterface, Sequelize) => queryInterface.removeConstraint('authentications', 'authentication_unique_constraint')
};
