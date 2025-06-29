const db = process.env.DB_PRIMARY || 'mysql';
module.exports = require(`./role.${db}`);