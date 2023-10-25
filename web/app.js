const bodyParser = require("body-parser");
const express = require("express");
const {
  readFileObject,
  PATH_DEVICES,
  PATH_PROJECTS,
  PATH_VOTE_RESULTS,
} = require("./utils");
const deviceRoute = require("./routes/device");
const projectRoute = require("./routes/project");
const voteRoute = require("./routes/vote");

const app = express();
const port = 4399;

app.use(bodyParser.json());
app.use("/api/device", deviceRoute);
app.use("/api/project", projectRoute);
app.use("/api/vote", voteRoute);

app.listen(port, () => {
  initApp();
  console.log(`Vote app starts at ${port}`);
});

function initApp() {
  global.votingPid = null; // current voting pid
  global.devices = readFileObject(PATH_DEVICES);
  global.projects = readFileObject(PATH_PROJECTS);
  global.voteResults = readFileObject(PATH_VOTE_RESULTS);

  console.log("Devices: ", global.devices);
  console.log("Projects: ", global.projects);
  console.log("VoteResults: ", global.voteResults);
}
