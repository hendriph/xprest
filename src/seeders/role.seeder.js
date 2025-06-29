require('dotenv').config();
const Role = require('../models/role.mysql');
const {MySQL, connectMysql} = require('../config/database/mysql');
const { dbLogs } = require('@utils/logger');

async function seedRoles() {
  await connectMysql();
  await MySQL.sync();
  const roles = [
    { name: 'admin', description: 'Administrator role' },
    { name: 'user', description: 'Regular user role' }
  ];
  for (const role of roles) {
    await Role.findOrCreate({ where: { name: role.name }, defaults: role });
  }
  dbLogs.info('✅ Roles seeded');
  process.exit(0);
}

seedRoles().catch((err) => {
  dbLogs.error('❌ Failed to seed roles:', err);
  process.exit(1);
});
