const express = require("express"),
  router = express.Router();

const { writeFile, PATH_DEVICES } = require("../utils");

router.put("/:id", (req, res) => {
  const { devices } = global;
  const deviceId = req.params.id;

  if (!devices.includes(deviceId)) {
    devices.push(deviceId);
    writeFile(PATH_DEVICES, devices);
  }

  res.status(200).send("ok");
});

module.exports = router;
