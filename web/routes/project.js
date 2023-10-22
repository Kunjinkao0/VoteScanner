const express = require("express"),
  router = express.Router();
const { v4: uuidv4 } = require("uuid");

const { writeFile, PATH_PROJECTS } = require("../utils");

router.put("/", (req, res) => {
  const p = req.body;
  global.projects.push({ _id: uuidv4(), ...p });
  writeFile(PATH_PROJECTS, global.projects);

  res.status(200).send("ok");
});

module.exports = router;
