const express = require("express"),
  router = express.Router();

const { writeFile, PATH_VOTE_RESULTS } = require("../utils");

router.get("/start", (req, res) => {
  if (global.projects.length === 0) {
    res.status(500).send(`No projects found`);
    return;
  }

  const targetPid = req.query.pid;
  const proj = global.projects.find((p) => p.pid === targetPid);
  if (!proj) {
    res.status(400).send("No project found.");
    return;
  }

  global.votingPid = targetPid;
  res.status(200).json(proj);
});

router.get("/stop", (_, res) => {
  global.votingPid = null;
  res.status(200).send("");
});

router.get("/submit", (req, res) => {
  const { deviceId, pid } = req.query;
  if (!deviceId) {
    res.status(400).send(`Invalid deviceId.`);
    return;
  }
  const { votingPid, projects, voteResults, allowedDevices } = global;
  const currentPid = pid || votingPid;
  if (!currentPid) {
    res.status(500).send(`Vote not started yet.`);
    return;
  }
  const result = voteResults.find(({ pid }) => pid === currentPid);
  const proj = projects.find((p) => p.pid === currentPid);

  // if (process.env.LIMITED_DEVICES && !deviceId.startWith("admin")) {
  //   if (!allowedDevices.includes(deviceId)) {
  //     res.status(500).send(`This device is not a valid one to vote.`);
  //     return;
  //   }
  // }

  if (deviceId === "admin-pop") {
    if (result.votes.length > 0) {
      result.votes.pop();
      console.log(`Pop [${proj.name}] from [admin-pop]:`);
      console.log("Current vote:");
      console.log(result.votes);
    }
    res.status(200).send({ count: result.votes.length });
    return;
  }

  if (result.votes.includes(deviceId)) {
    res.status(200).send("This device already voted.");
    return;
  }

  result.votes.push(deviceId);
  console.log(`Vote [${proj.name}] from device [${deviceId}]:`);
  console.log("Current vote:");
  console.log(result.votes);
  writeFile(PATH_VOTE_RESULTS, voteResults);
  res.status(200).send({ count: result.votes.length });
});

router.get("/reset", (req, res) => {
  const { pid } = req.query;
  const { projects, voteResults } = global;
  const result = voteResults.find((v) => v.pid === pid);
  const proj = projects.find((p) => p.pid === pid);
  result.votes = [];

  console.log(`Reset [${proj.name}]'s vote, now:`);
  console.log(result);
  writeFile(PATH_VOTE_RESULTS, voteResults);
  res.status(200).send("ok");
});

router.get("/count", (req, res) => {
  const { pid } = req.query;
  const result = voteResults.find((p) => p.pid === pid);

  res.status(200).json({ count: result.votes.length, current: votingPid });
});

router.get("/result", (req, res) => {
  const { voteResults, projects } = global;
  const results = voteResults.map((r) => {
    const pname = projects.find(({ pid }) => pid === r.pid)?.name;

    return { pid: r.pid, name: pname, count: r.votes.length };
  });
  res.status(200).json(results);
});

module.exports = router;
