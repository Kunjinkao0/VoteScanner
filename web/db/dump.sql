PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE project_vote_relationship (
      vote_id UUID,
      project_id UUID,
      FOREIGN KEY (vote_id) REFERENCES vote_record(id),
      FOREIGN KEY (project_id) REFERENCES project(id)
    );
CREATE TABLE activity (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  start_time DATE,
  end_time DATE
);
CREATE TABLE trusted_device (
  id TEXT PRIMARY KEY,
  name TEXT
);
INSERT INTO trusted_device VALUES('0xf6d6d017',NULL);
CREATE TABLE project (
  id UUID PRIMARY KEY,
  name TEXT,
  desc TEXT,
  cover TEXT
);
INSERT INTO project VALUES('ee400864-3b4c-4a94-8aa4-d5022360f075','Chopper','I-01',NULL);
INSERT INTO project VALUES('05c82924-516b-4b8f-937c-4808b9a6ea0f','人见人eye','I-05',NULL);
INSERT INTO project VALUES('05d4bd88-721a-467e-8e1d-d5c08ad883ac','Skyrocket','I-06',NULL);
INSERT INTO project VALUES('8e25970d-fa9e-4089-8007-f80f6ad6e5a4','ATN+','I-07',NULL);
INSERT INTO project VALUES('922147e3-78a1-4c34-b129-cca3c558a0b2','Infinite Game','I-08',NULL);
INSERT INTO project VALUES('f79ddf84-a810-4c12-8ac8-576bd01940be','创意工作室','I-09',NULL);
INSERT INTO project VALUES('05eb3e6e-512c-4e44-af38-d75fdd28d90e','Streamer','I-10',NULL);
INSERT INTO project VALUES('ecd4faa4-8803-412b-a7bd-b1b55ec09712','Dream Chaser','I-11',NULL);
INSERT INTO project VALUES('66a96bf7-df39-4d2d-b28d-957bd566153e','艾莉芬特','I-12',NULL);
INSERT INTO project VALUES('6808d63b-8e2c-4271-b54f-ca36cf8e9750','深藏Blue队','I-13',NULL);
INSERT INTO project VALUES('6493a9b2-c121-42f7-acec-9c38a4719eaf','XHood','I-14',NULL);
INSERT INTO project VALUES('3afb0aaf-c7dc-445b-a495-1f936b19d62b','GenBridge','I-15',NULL);
INSERT INTO project VALUES('a70bcd78-f534-44fa-a955-a18a60780386','Aha','I-16',NULL);
INSERT INTO project VALUES('7d848c55-565d-4a16-9ea8-ebf5c72ef090','Smart Widget','I-17',NULL);
INSERT INTO project VALUES('345a1f47-c2a7-48f4-820e-83d5c3f135a9','Avalon','I-18',NULL);
INSERT INTO project VALUES('963eeec1-deed-4a71-9699-5b6b7e84158a','Zoom in UMH','I-19',NULL);
INSERT INTO project VALUES('d1d72eab-26da-4d32-86d5-d9c60d7bc2e5','The Reunion','I-20',NULL);
INSERT INTO project VALUES('5b7b4cc8-b901-4f33-9f2f-8487583178ec','北斗(The Dipper)','I-21',NULL);
INSERT INTO project VALUES('31391475-b70e-4161-901c-44e950e45b30','VR?VR.VR!','I-22',NULL);
INSERT INTO project VALUES('7ebc97a6-5657-4135-aade-eb76fc079e1f','发际线与我作队','I-23',NULL);
INSERT INTO project VALUES('7a18d7cd-9559-4452-8a56-69511ec2f0fc','Portfolio plus','I-24',NULL);
INSERT INTO project VALUES('0bd6664a-3ead-4282-b505-b4c959aa0cd5','Seed','I-25',NULL);
INSERT INTO project VALUES('1910d481-4a75-4054-a64a-612b4306a4c9','一支独秀','I-26',NULL);
INSERT INTO project VALUES('e5f8c260-fb50-40e3-be48-10227e5feb13','小葫芦冰糖','I-27',NULL);
INSERT INTO project VALUES('1aeebc5d-5a0e-4654-b559-c13ab9062920','Knight Riders','I-28',NULL);
INSERT INTO project VALUES('57614003-ca56-4a3e-a91c-448e78f7ccdb','六神有组','I-29',NULL);
INSERT INTO project VALUES('4aa9d77d-bbfc-433f-a39f-1f0a85c97f05','富达钱包','I-30',NULL);
INSERT INTO project VALUES('b252672a-1999-45d1-ad8f-2834550bc03a','三侠五义','I-02',NULL);
INSERT INTO project VALUES('540c92e5-c9ae-4c01-8ae1-fdce7e296d92','YOUTH CODE','I-03',NULL);
INSERT INTO project VALUES('5c196cdf-8bc1-4980-9eef-72609d8e03f6','我是你的眼','I-04',NULL);
CREATE TABLE activity_project_relationship (
  activity_id UUID,
  project_id UUID,
  FOREIGN KEY (activity_id) REFERENCES activity(id),
  FOREIGN KEY (project_id) REFERENCES trusted_device(id)
);
CREATE TABLE activity_device_relationship (
  activity_id UUID,
  device_id UUID,
  FOREIGN KEY (activity_id) REFERENCES activity(id),
  FOREIGN KEY (device_id) REFERENCES device(id)
);
CREATE TABLE vote_record (
  id UUID PRIMARY KEY,
  time DATE,
  device_id TEXT,
  score INT
);
DELETE FROM sqlite_sequence;
COMMIT;
