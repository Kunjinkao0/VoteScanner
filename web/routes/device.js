const express = require("express"),
  router = express.Router();

const { dbRun, dbGet } = require("../db");

router.put("/", async (req, res) => {
  try {
    const { deviceId } = req.body;

    const querySql = "SELECT id FROM trusted_device where id = ?";
    const existed = await dbGet(querySql, [deviceId]);
    if (existed) {
      res.status(400).send("Already registed.");
      return;
    }

    const sql = "INSERT INTO trusted_device (id) VALUES (?)";
    await dbRun(sql, [deviceId]);
    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
