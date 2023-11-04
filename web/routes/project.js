const express = require("express"),
  router = express.Router();
const { v4: uuidv4 } = require("uuid");

const { dbRun, dbAll } = require("../db.js");

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

router.put("/", async (req, res) => {
  let { name, desc, cover } = req.body;
  if (!name) {
    name = RANDOM_NAME[Math.floor(Math.random() * RANDOM_NAME.length)];
  }
  try {
    const pid = uuidv4();
    const sql =
      "INSERT INTO project (id, name, desc, cover) VALUES (?, ?, ?, ?)";
    await dbRun(sql, [pid, name, desc, cover]);
    res.status(200).json({ id: pid });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.delete("/:pid", async (req, res) => {
  const { pid } = req.params;
  if (!pid) {
    res.status(400).send("No project found.");
    return;
  }

  try {
    const sql = "DELETE FROM project WHERE id = ?";

    await dbRun(sql, [pid]);
    res.status(200).send("ok");
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.get("/", async (_, res) => {
  try {
    const sql = "SELECT * FROM project";

    const result = await dbAll(sql);
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

module.exports = router;
