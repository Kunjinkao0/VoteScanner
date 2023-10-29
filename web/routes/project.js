const express = require("express"),
  router = express.Router();
const { v4: uuidv4 } = require("uuid");

const { writeFile, PATH_PROJECTS, PATH_VOTE_RESULTS } = require("../utils");

const RANDOM_NAME = [
  "Investment Revolutionizer",
  "Innovate to Grow Investments",
  "Wealth Creation Innovator",
  "Idea Catalyst for Investments",
  "Invest Innovatively for Better Returns",
  "Innovation-Driven Investment Growth",
  "Capitalizing on Innovative Ideas",
  "Investment Ideas Reimagined",
  "Innovate Your Investment Portfolio",
  "Maximizing Returns through Innovative Strategies",
  "Investment Innovation for Financial Success",
  "Elevating Wealth with Innovative Investments",
  "Creative Capital Ventures",
  "Idea-Driven Investment Excellence",
  "Investing in Tomorrow's Innovations",
  "Innovate and Prosper",
  "Innovative Strategies for Wealth Growth",
  "Idea Infusion in Investments",
  "Investing in Innovation for Prosperity",
  "The Path to Wealth: Innovate Your Investments",
];

router.get("/add", (req, res) => {
  const p = req.params;
  if (!p.name) {
    p.name = RANDOM_NAME[Math.floor(Math.random() * RANDOM_NAME.length)];
  }
  const pid = uuidv4();
  global.projects.push({ pid, ...p });
  writeFile(PATH_PROJECTS, global.projects);

  global.voteResults.push({ pid, votes: [] });
  writeFile(PATH_VOTE_RESULTS, global.voteResults);

  res.status(200).send("ok");
});

router.get("/del", (req, res) => {
  const { pid } = req.params;
  if (!pid) {
    res.status(400).send("No project found.");
    return;
  }
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
