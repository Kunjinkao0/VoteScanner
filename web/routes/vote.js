const express = require("express"),
  router = express.Router();
const { v4: uuidv4 } = require("uuid");
const {
  USE_TRUSTED_DEVICES,
  VOTE_SCORE,
  VOTE_ADMIN_UP_SCORE,
  VOTE_ADMIN_DOWN_SCORE,
} = require("../config");
const { dbGet, dbRun, dbAll } = require("../db");

async function getScoreOfProject(pid) {
  const summarySql = `
      SELECT SUM(vr.score) AS total
      FROM vote_record vr
      JOIN project_vote_relationship pvr ON vr.id = pvr.vote_id
      WHERE pvr.project_id = ?;
    `;
  const _result = await dbAll(summarySql, [pid]);
  const result = _result[0];
  if (result.total === null || result.total < 0) result.total = 0;
  return result;
}

router.post("/start", async (req, res) => {
  const { pid } = req.body;
  const sql = "SELECT * FROM project WHERE id = ?";
  const project = await dbGet(sql, [pid]);
  if (!project) {
    res.status(400).send("Invalid project Id");
    return;
  }

  global.votingPid = pid;
  console.log(`--- Vote STARTED for project [${project.name}]`);
  res.status(200).send("ok");
});

router.post("/stop", (_, res) => {
  global.votingPid = null;
  console.log(`--- Vote STOPPED ---`);
  res.status(200).send("");
});

/**
 * Vote flow(basic checking like param not null will not be explaned here):
 * 1. if  given deviceId is not "admin"
 *  - check if it's a trusted device(configured in .env)
 *  - check if device had been submitted
 * 2. get score value of this vote(configured in .env)
 *  - admin-down for -2
 *  - admin-up for 1
 *  - common for 1
 * 3. check if given deviceId exsied in record, if so just return success
 * 4. insert into vote_record with deviceId
 * 5. insert into project_vote_relationship with record_id and project_id
 */
router.post("/submit", async (req, res) => {
  const { deviceId, pid } = req.body;
  const currentPid = pid || votingPid;
  if (!deviceId) {
    res.status(400).send(`You should provide a deviceId.`);
    return;
  }
  if (!currentPid) {
    res.status(400).send(`Vote not started yet.`);
    return;
  }
  try {
    if (!deviceId.startsWith("admin")) {
      // check if is trusted devices
      if (USE_TRUSTED_DEVICES) {
        const trustDeviceSql =
          "SELECT COUNT(*) AS deviceCount FROM trusted_device WHERE id = ?";
        const { deviceCount } = await dbGet(trustDeviceSql, [deviceId]);
        if (deviceCount == 0) {
          res
            .status(400)
            .send(`Given device is not a trusted device, please check.`);
          return;
        }
      }

      // check if voted
      const votedCheckSql = `SELECT vr.*
        FROM vote_record vr
        JOIN project_vote_relationship pvr ON vr.id = pvr.vote_id
        WHERE pvr.project_id = ? AND vr.device_id = ?;
      `;
      const votedRows = await dbAll(votedCheckSql, [currentPid, deviceId]);
      if (votedRows.length > 0) {
        res.status(400).send("This device had been already voted.");
        return;
      }
    }

    const score =
      deviceId === "admin-down"
        ? VOTE_ADMIN_DOWN_SCORE
        : deviceId === "admin-up"
        ? VOTE_ADMIN_UP_SCORE
        : VOTE_SCORE;
    const vid = uuidv4();
    const time = new Date();
    // consider a statement below
    const addVoteRecordSql =
      "INSERT INTO vote_record (id, time, device_id, score) VALUES (?, ?, ?, ?)";
    await dbRun(addVoteRecordSql, [vid, time, deviceId, score]);

    const addRelationSql =
      "INSERT INTO project_vote_relationship (vote_id, project_id) VALUES (?, ?)";
    await dbRun(addRelationSql, [vid, currentPid]);

    const result = await getScoreOfProject(currentPid);
    res.status(200).send(result);
  } catch (e) {
    console.error(e);
    res.status(500).send(`Error occured in voting.`);
  }
});

router.post("/reset", async (req, res) => {
  try {
    const { pid } = req.body;
    const deleteRelationshipSQL =
      "DELETE FROM project_vote_relationship WHERE project_id = ?";
    await dbRun(deleteRelationshipSQL, [pid]);
    const deleteVoteRecordSQL =
      "DELETE FROM vote_record WHERE id NOT IN (SELECT vote_id FROM project_vote_relationship)";
    await dbRun(deleteVoteRecordSQL);
    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get("/project/:pid/total", async (req, res) => {
  const { pid } = req.params;

  try {
    const summarySql = `
      SELECT SUM(vr.score) AS total
      FROM vote_record vr
      JOIN project_vote_relationship pvr ON vr.id = pvr.vote_id
      WHERE pvr.project_id = ?;
    `;
    const _result = await dbAll(summarySql, [pid]);
    const result = _result[0];
    if (result.total === null) result.total = 0;
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get("/results", async (_, res) => {
  try {
    const sql = `
      SELECT pvr.project_id AS projectId, SUM(vr.score) AS total
      FROM project_vote_relationship pvr
      JOIN vote_record vr ON pvr.vote_id = vr.id
      GROUP BY pvr.project_id;
    `;

    const result = await dbAll(sql);
    console.log(result);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
