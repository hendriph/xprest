const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../storages/uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

function slugify(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9\-_.]/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const slug = slugify(base);
    const unique = Date.now() + '-' + slug + ext;
    cb(null, unique);
  }
});

const upload = multer({ storage });

module.exports = upload;