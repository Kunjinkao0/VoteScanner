const sqlite3 = require("sqlite3").verbose();
const util = require("util");

const db = new sqlite3.Database("./db/vote.db");
const dbAll = util.promisify(db.all.bind(db));
const dbGet = util.promisify(db.get.bind(db));
const dbRun = util.promisify(db.run.bind(db));

module.exports = { _db: db, dbAll, dbGet, dbRun };
