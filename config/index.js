const Cloud = require("@google-cloud/storage");
require("dotenv").config();

const { Storage } = Cloud;

let storageConfig = {
  projectId: process.env.PROJECT_ID,
};

// Tambahkan keyFilename jika dijalankan secara lokal
if (process.env.NODE_ENV !== "production") {
  const path = require("path");
  const serviceKey = path.join(__dirname, "./keys.json");
  storageConfig.keyFilename = serviceKey;
}

// Inisialisasi storage
const storage = new Storage(storageConfig);

module.exports = storage;
