const fs = require('fs');
const path = require('path');
const cacheDir = path.join(__dirname, '.cache');

if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);

const filePath = (key) => path.join(cacheDir, `${key}.json`);

module.exports = {
  set: (key, value) => {
    fs.writeFileSync(filePath(key), JSON.stringify({ value, timestamp: Date.now() }));
  },
  get: (key, ttl = 600000) => {
    const fullPath = filePath(key);
    if (!fs.existsSync(fullPath)) return null;
    const data = JSON.parse(fs.readFileSync(fullPath));
    if (Date.now() - data.timestamp > ttl) {
      fs.unlinkSync(fullPath);
      return null;
    }
    return data.value;
  },
  del: (key) => {
    const fullPath = filePath(key);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
};
