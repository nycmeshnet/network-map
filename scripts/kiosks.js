const fetch = require("node-fetch");
const fs = require("fs");

const STATUS_TYPES = {
  "Link Active!": "active",
  "Link Pending Activation": "pending",
  "Link Installed; Connecting Power and Fiber": "installed"
};

function getKiosks(cb) {
  process.stdout.write("[3/3] 🔗 Fetching Kiosks...");
  fetch(
    "https://data.cityofnewyork.us/api/views/s4kf-3yrf/rows.json?accessType=DOWNLOAD"
  )
    .then(res => res.json())
    .then(res => {
      const { data } = res;
      const links = data.map(rowToLink);

      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      console.log(`[3/3] 🔗 ${links.length} Kiosks.`);

      if (cb) {
        cb(links);
      }
    })
    .catch(err => {
      console.log(err);
    });
}

function rowToLink(row) {
  const id = row[1];
  const lat = parseFloat(row[12]);
  const lng = parseFloat(row[13]);
  const street = row[16];
  const neighborhood = row[21];
  const borough = row[9];
  const status = STATUS_TYPES[row[14]];
  return {
    id: id,
    status: status,
    coordinates: [lng, lat]
  };
}

module.exports = getKiosks;
