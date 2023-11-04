const sqlite3 = require("sqlite3").verbose();

if (process.argv.length < 3) {
  console.log('Usage: node execute-sql.js "YOUR_SQL_STATEMENT"');
  process.exit(1);
}

const sql = process.argv[2];

const db = new sqlite3.Database("vote.db");

db.all(sql, [], (err, rows) => {
  if (err) {
    console.error(err.message);
    return;
  }

  console.log("Query result:");
  console.log(rows);

  db.close((closeErr) => {
    if (closeErr) {
      console.error(closeErr.message);
    } else {
      // console.log("Database connection closed.");
    }
  });
});
