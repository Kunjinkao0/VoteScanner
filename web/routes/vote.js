const express = require("express"),
  router = express.Router();

const { writeFile, PATH_VOTE_RESULTS } = require("../utils");

router.get("/start", (_, res) => {
  if (global.projects.length === 0) {
    res.status(500).send(`No projects found`);
    return;
  }

  global.voteIndex = 0;
  res.status(200).send(`Vote starts at ${global.projects[0].name}`);
});

router.post("/", (req, res) => {
  const { voteIndex, projects, voteResults } = global;
  if (voteIndex < 0) {
    res.status(500).send(`Vote not started`);
    return;
  }

  const { deviceId } = req.body;
  const targetId = projects[voteIndex]._id;
  let result = voteResults.find(({ pid }) => pid === targetId);
  if (!result) {
    result = { pid: targetId, votes: [deviceId] };
    voteResults.push(result);
  }

  if (!result.votes.includes(deviceId)) {
    result.votes.push(deviceId);
  }

  console.log(`Vote [${projects[voteIndex].name}] from device [${deviceId}]`);
  console.log(voteResults);
  writeFile(PATH_VOTE_RESULTS, voteResults);

  res.status(200).send("ok");
});

router.get("/next", (_, res) => {
  if (voteIndex < 0) {
    res.status(500).send(`You should start vote first`);
    return;
  }
  global.voteIndex++;
  res.status(200).send("ok");
});

module.exports = router;
