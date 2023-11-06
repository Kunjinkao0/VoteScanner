const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const { dbRun } = require("./db");

function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\r\n");
  // const headers = lines[0].split(",");
  const headers = ["name", "team"];
  const data = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;
    const values = line.split(",");
    const entry = {};

    for (let j = 0; j < headers.length; j++) {
      entry[headers[j].trim()] = values[j].trim();
    }

    data.push(entry);
  }

  return data;
}

const args = process.argv.slice(2);

if (args.length !== 1) {
  console.error("Provide a csv file.");
  process.exit(1);
}

const filePath = args[0];

const parsedData = parseCSV(filePath);
// console.log(parsedData);

parsedData.forEach(async (p) => {
  const pid = uuidv4();
  const sql = "INSERT INTO project (id, name, desc, cover) VALUES (?, ?, ?, ?)";
  await dbRun(sql, [pid, p.name, p.team, null]);
  console.log(`Inserted: [${p.name}]-[${p.team}]`);
});
