PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE trusted_device (
  id TEXT PRIMARY KEY,
  name TEXT
);
INSERT INTO trusted_device VALUES('0xf6d6d017',NULL);
COMMIT;
