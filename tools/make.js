const fs = require('fs');
const path = require('path');

const name = process.argv[2];
if (!name) {
  console.error('❌ Please provide a module name. Usage: npm run make:controller User');
  process.exit(1);
}

const fileName = name.toLowerCase();
const className = name.charAt(0).toUpperCase() + name.slice(1);

const templates = {
  controller: `exports.index = (req, res) => {
  res.json({ message: '${className} index endpoint' });
};`,
  service: `module.exports = {
  findAll: async () => {
    return [];
  },
};`,
  route: `const router = require('express').Router();
const controller = require('../../controllers/${fileName}.controller');

router.get('/', controller.index);

module.exports = router;`,
  validation: `const Joi = require('joi');

module.exports = {
  create${className}Schema: Joi.object({
    name: Joi.string().required()
  })
};`
};

const targets = {
  controller: `src/controllers/${fileName}.controller.js`,
  service: `src/services/${fileName}.service.js`,
  route: `src/routes/v1/${fileName}.route.js`,
  validation: `src/validations/${fileName}.validation.js`
};

for (const [type, content] of Object.entries(templates)) {
  const targetPath = path.resolve(__dirname, '..', targets[type]);
  fs.mkdirSync(path.dirname(targetPath), { recursive: true });
  fs.writeFileSync(targetPath, content);
  console.log(`✅ ${type} created at ${targets[type]}`);
}
