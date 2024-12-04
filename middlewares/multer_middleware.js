// Not finished yet
// Upload Image
const multer = require("multer");

const multerMid = multer({
  storage: multer.memoryStorage(),
  limits: {
    // no larger than 2mb.
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = multerMid;
