const fs = require("fs");

function parseCSV(filePath) {
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const lines = fileContent.split("\n");
  const headers = lines[0].split(",");
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.trim() === "") continue;
    const values = line.split(",");
    const entry = {};

    for (let j = 0; j < headers.length; j++) {
      entry[headers[j]] = values[j];
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
console.log(parsedData);
