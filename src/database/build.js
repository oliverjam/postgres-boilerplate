const fs = require("fs");
const path = require("path");
const db = require("./connection");

// get the contents of our init.sql file
const initPath = path.join(__dirname, "init.sql");
const initSQL = fs.readFileSync(initPath, "utf-8");

// run the init.sql file on our database
db.query(initSQL)
  .then(() => {
    console.log("Database built");
    db.end(); // close the connection as we're finished
  })
  .catch(console.log);
