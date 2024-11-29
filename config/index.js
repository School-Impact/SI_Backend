// Not finished yet
/**
 * === Especially for serviceKey variable ===
 * Generate key from service account :
 * Navigation menu => IAM & Admin => Service Accounts => Choose service account => Click 'Keys' tab => Click 'add key' & 'create new key' => Choose 'JSON' as key type
 * The file will be downloaded
 * Copy or Cut key JSON and paste in config folder same as the index config (not mandatory, not have to same as index config)
 *
 * === Warning Message ===
 * (node:16512) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
 * (Use `node --trace-deprecation ...` to show where the warning was created)
 *
 * You can ignore this warning, it's from @google-cloud/storage package
 */

const Cloud = require("@google-cloud/storage");
const path = require("path");
require("dotenv").config();
const serviceKey = path.join(__dirname, "./keys.json");

const { Storage } = Cloud;
const storage = new Storage({
  keyFilename: serviceKey,
  projectId: process.env.PROJECT_ID,
});

module.exports = storage;
