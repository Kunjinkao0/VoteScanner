const express = require("express"),
  router = express.Router();

const { writeFile, PATH_DEVICES } = require("../utils");

router.put("/:id", (req, res) => {
  const { allowedDevices } = global;
  const deviceId = req.params.id;

  if (!allowedDevices.includes(deviceId)) {
    allowedDevices.push(deviceId);
    writeFile(PATH_DEVICES, allowedDevices);
  }

  res.status(200).send("ok");
});

module.exports = router;
