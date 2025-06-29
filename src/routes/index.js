const express = require('express');
const fs = require('fs');
const path = require('path');
const { routesLogs } = require('@utils/logger');

const router = express.Router();
const basename = path.basename(__filename);
const routesDir = __dirname;

function registerRoutes(dirPath, routePrefix = '') {
  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const newPrefix = path.join(routePrefix, file);
      registerRoutes(fullPath, newPrefix);
    } else if (
      file !== basename &&
      file.endsWith('.route.js')
    ) {
      const route = require(fullPath);

      const routeName = path
        .join(routePrefix, file)
        .replace(/\\/g, '/')
        .replace(/\.route\.js$/i, '');

      routesLogs.info(`✓ Route registered: /${routeName}`);

      router.use(`/${routeName}`, route);
    }
  });
}

registerRoutes(routesDir);

module.exports = router;