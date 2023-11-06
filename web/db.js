const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const util = require("util");
const { DB_NAME } = require("./config");

console.log(`Current DB: [${DB_NAME}]`);

const dbUrl = path.resolve(__dirname, `./db/${DB_NAME}`);
const db = new sqlite3.Database(dbUrl);
const dbAll = util.promisify(db.all.bind(db));
const dbGet = util.promisify(db.get.bind(db));
const dbRun = util.promisify(db.run.bind(db));

module.exports = { _db: db, dbAll, dbGet, dbRun };
