// Dumps service ids and per-region counts for the page generator.
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const source = fs.readFileSync(path.join(root, "data.js"), "utf8");
const factory = new Function(source + "; return { SERVICES };");
const { SERVICES } = factory();

const counts = {};
for (const service of SERVICES) {
  for (const region of service.regions) counts[region] = (counts[region] || 0) + 1;
}

process.stdout.write(JSON.stringify({ counts, ids: SERVICES.map((s) => s.id) }));
