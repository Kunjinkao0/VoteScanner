const sqlite3 = require("sqlite3").verbose();
const util = require("util");

const db = new sqlite3.Database("vote.db");
const run = util.promisify(db.run.bind(db));

(async () => {
  try {
    await run("DROP TABLE IF EXISTS activity");
    await run("DROP TABLE IF EXISTS trusted_device");
    await run("DROP TABLE IF EXISTS project");
    await run("DROP TABLE IF EXISTS activity_project_relationship");
    await run("DROP TABLE IF EXISTS activity_device_relationship");
    await run("DROP TABLE IF EXISTS vote_record");
    await run("DROP TABLE IF EXISTS vote_project_relationship");
    await run(`
    CREATE TABLE IF NOT EXISTS activity (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      start_time DATE,
      end_time DATE
    )
    `);
    await run(`
    CREATE TABLE IF NOT EXISTS trusted_device (
      id TEXT PRIMARY KEY,
      name TEXT
    )
    `);
    await run(`
    CREATE TABLE IF NOT EXISTS project (
      id UUID PRIMARY KEY,
      name TEXT,
      desc TEXT,
      cover TEXT
    )
    `);
    await run(`    
    CREATE TABLE IF NOT EXISTS activity_project_relationship (
      activity_id UUID,
      project_id UUID,
      FOREIGN KEY (activity_id) REFERENCES activity(id),
      FOREIGN KEY (project_id) REFERENCES trusted_device(id)
    )
    `);
    await run(`    
    CREATE TABLE IF NOT EXISTS activity_device_relationship (
      activity_id UUID,
      device_id UUID,
      FOREIGN KEY (activity_id) REFERENCES activity(id),
      FOREIGN KEY (device_id) REFERENCES device(id)
    )
    `);
    await run(`    
    CREATE TABLE IF NOT EXISTS vote_record (
      id UUID PRIMARY KEY,
      time DATE,
      device_id TEXT,
      score INT
    )
    `);
    await run(`    
    CREATE TABLE IF NOT EXISTS project_vote_relationship (
      vote_id UUID,
      project_id UUID,
      FOREIGN KEY (vote_id) REFERENCES vote_record(id),
      FOREIGN KEY (project_id) REFERENCES project(id)
    )
    `);
    console.log("Tables created successfully");

    db.close();
  } catch (error) {
    console.error(error);
    db.close();
  }
})();
