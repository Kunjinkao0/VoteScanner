const express = require("express"),
  router = express.Router();
const { v4: uuidv4 } = require("uuid");

const { writeFile, PATH_PROJECTS, PATH_VOTE_RESULTS } = require("../utils");

router.put("/", (req, res) => {
  const p = req.body;
  const pid = uuidv4();
  global.projects.push({ pid, ...p });
  writeFile(PATH_PROJECTS, global.projects);

  global.voteResults.push({ pid, votes: [] });
  writeFile(PATH_VOTE_RESULTS, global.voteResults);

  res.status(200).send("ok");
});

router.get("/detail/:pid", (req, res) => {
  const proj = global.projects.find((p) => p.pid === req.params.pid);
  if (!proj) {
    res.status(400).send("No project found.");
    return;
  }

  res.status(200).json(proj);
});

router.get("/all", (_, res) => {
  res.status(200).json(global.projects);
});

module.exports = router;
