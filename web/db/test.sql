-- reset all
DROP TABLE IF EXISTS activity;
DROP TABLE IF EXISTS trusted_device;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS activity_project_relationship;
DROP TABLE IF EXISTS activity_device_relationship;
DROP TABLE IF EXISTS vote_record;
DROP TABLE IF EXISTS vote_project_relationship;

CREATE TABLE IF NOT EXISTS activity (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_time DATE,
  end_time DATE
);

CREATE TABLE IF NOT EXISTS trusted_device (
  id TEXT PRIMARY KEY,
  name TEXT
);

CREATE TABLE IF NOT EXISTS project (
  id UUID PRIMARY KEY,
  name TEXT,
  desc TEXT,
  cover TEXT
);

CREATE TABLE IF NOT EXISTS activity_project_relationship (
  activity_id UUID,
  project_id UUID,
  FOREIGN KEY (activity_id) REFERENCES activity(id),
  FOREIGN KEY (project_id) REFERENCES trusted_device(id)
);

CREATE TABLE IF NOT EXISTS activity_device_relationship (
  activity_id UUID,
  device_id UUID,
  FOREIGN KEY (activity_id) REFERENCES activity(id),
  FOREIGN KEY (device_id) REFERENCES device(id)
);

CREATE TABLE IF NOT EXISTS vote_record (
  id UUID PRIMARY KEY,
  time DATE,
  device_id TEXT,
  score INT
);

CREATE TABLE IF NOT EXISTS project_vote_relationship (
  vote_id UUID,
  project_id UUID,
  FOREIGN KEY (vote_id) REFERENCES vote_record(id),
  FOREIGN KEY (project_id) REFERENCES project(id)
);

-- delete 
DELETE FROM project;
DELETE FROM project_vote_relationship;
DELETE FROM vote_record;
DELETE FROM trusted_device;

-- sqlite3 vote_c.db ".dump trusted_device" > trusted_device.sql

select count(*) from trusted_device;