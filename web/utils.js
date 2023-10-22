const path = require("path");
const fs = require("fs");

const PATH_DEVICES = path.resolve(__dirname, "./datas/devices.json");
const PATH_PROJECTS = path.resolve(__dirname, "./datas/projects.json");
const PATH_VOTE_RESULTS = path.resolve(__dirname, "./datas/vote-results.json");

function readFileObject(PATH) {
  return JSON.parse(fs.readFileSync(PATH));
}

function writeFile(PATH, _content) {
  const content =
    typeof _content === "string" ? _content : JSON.stringify(_content);
  fs.writeFileSync(PATH, content, { encoding: "utf8" });
}

module.exports = {
  PATH_DEVICES,
  PATH_PROJECTS,
  PATH_VOTE_RESULTS,
  readFileObject,
  writeFile,
};
