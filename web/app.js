const bodyParser = require("body-parser");
const express = require("express");
const deviceRoute = require("./routes/device");
const projectRoute = require("./routes/project");
const voteRoute = require("./routes/vote");
const { dbAll } = require("./db.js");

const app = express();
const port = 4399;

app.use("/public", express.static("public"));
app.use(bodyParser.json());

app.use("/api/devices", deviceRoute);
app.use("/api/projects", projectRoute);
app.use("/api/vote", voteRoute);

app.listen(port, async () => {
  console.log(`Vote app starts at ${port}`);
  await initApp();
});

async function initApp() {
  global.votingPid = null; // current voting pid

  try {
    const trustedDevices = await dbAll("SELECT * FROM trusted_device");
    const projects = await dbAll("SELECT * FROM project");
    console.log("Trusted Devices in total: ", trustedDevices.length);
    console.log("Saved Projects in total:  ", projects.length);
  } catch (e) {
    console.error(e);
  }
  // console.log("Projects: ", rows);

  // console.log("Devices: ", global.allowedDevices);
  // console.log("VoteResults: ", global.voteResults);
}
