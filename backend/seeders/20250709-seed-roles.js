// Seeder for Roles table
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Roles', [
      { name: 'Admin', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Project Manager', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Developer', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Tester', createdAt: new Date(), updatedAt: new Date() },
      { name: 'Viewer', createdAt: new Date(), updatedAt: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Roles', null, {});
  }
};
