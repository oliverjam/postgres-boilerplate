const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config(); // load environment variables

let connectionString = process.env.DATABASE_URL;

// use a different DB if we're testing
if (process.env.NODE_ENV === "test") {
  connectionString = process.env.TEST_DATABASE_URL;
}

const db = new pg.Pool({
  connectionString,
});

module.exports = db;
