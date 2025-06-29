const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const openapiSpec = YAML.load(path.resolve(__dirname, '../docs/openapi.yaml'));

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(openapiSpec),
};
