// Seeder for Admin user
'use strict';

const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Find Admin role id
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'Admin' LIMIT 1;`
    );
    const adminRoleId = roles[0]?.id;
    if (!adminRoleId) throw new Error('Admin role not found');

    const passwordHash = await bcrypt.hash('admin123', 10);
    await queryInterface.bulkInsert('Users', [
      {
        name: 'Admin User',
        email: 'admin@teamtasker.com',
        password: passwordHash,
        roleId: adminRoleId,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@teamtasker.com' }, {});
  }
};
