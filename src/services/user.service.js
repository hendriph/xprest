const db = process.env.DB_PRIMARY || 'mysql';
module.exports = require(`./user.${db}`);