var GoogleSpreadsheet = require("google-spreadsheet");
const fs = require("fs");

const {
  CREDENTIALS,
  SPREADSHEET_ID,
  NODES_WORKSHEET,
  LINK_WORKSHEET,
  PANO_PATH
} = require("./config");

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

const coordinates = {};

function getNodesAndLinks(cb) {
  doc.useServiceAccountAuth(CREDENTIALS, () => {
    getNodes((active, potential) => {
      getLinks(links => {
        if (cb) {
          cb({
            active,
            potential,
            links
          });
        }
      });
    });
  });
}

function getNodes(cb) {
  process.stdout.write("[1/3] 📡 Fetching Nodes...");
  doc.getRows(NODES_WORKSHEET, function(err, rows) {
    if (err) {
      console.log(err);
      return;
    }

    const nodes = rows.map(nodeFromRow).filter(removeAbandoned);
    const active = nodes.filter(node => node.status === "Installed");
    const potential = nodes.filter(node => node.status !== "Installed");

    // Store coordinates for lookup by node id
    nodes.forEach(node => {
      coordinates[node.id] = node.coordinates;
    });

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(
      `[1/3] 📡 ${active.length} Nodes, ${potential.length} Requests.`
    );

    if (cb) {
      cb(active, potential);
    }
  });
}

function getLinks(cb) {
  process.stdout.write("[2/3] ⚡️ Fetching Links...");
  doc.getRows(LINK_WORKSHEET, function(err, rows) {
    if (err) {
      console.log(err);
      return;
    }

    const links = rows.map(linkFromRow).filter(link => link);

    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    console.log(`[2/3] ⚡️ ${links.length} Links.`);

    if (cb) {
      cb(links);
    }
  });
}

function nodeFromRow(row, index) {
  const {
    name,
    email,
    phone,
    status,
    latlng,
    location,
    rooftopaccess,
    notes,
    timestamp
  } = row;

  const node = {
    id: index + 2,
    // name,
    // email,
    // phone,
    status,
    latlng,
    // location,
    rooftopaccess,
    notes
    // timestamp
  };

  node.coordinates = sanitizeCoordinates(latlng);
  if (!node.coordinates) {
    // console.log(`Node ${node.id} invalid coordinates: ${latlng}`);
    return;
  }

  const panoramas = getPanoramas(node.id);
  if (panoramas.length) {
    node.panoramas = panoramas;
  }

  return node;
}

function linkFromRow(row) {
  if (row && row.from && row.to && row.status) {
    const fromLatLng = coordinates[row.from];
    const toLatLng = coordinates[row.to];

    // Validate coordinates
    if (
      !fromLatLng ||
      !fromLatLng[0] ||
      !fromLatLng[1] ||
      !toLatLng ||
      !toLatLng[0] ||
      !toLatLng[1]
    ) {
      // console.log(
      //   `Link from ${row.from} to ${
      //     row.to
      //   } invalid coordinates: ${fromLatLng} ${toLatLng}`
      // );
      return;
    }

    const link = {
      from: parseInt(row.from),
      to: parseInt(row.to),
      status: row.status,
      coordinates: [fromLatLng, toLatLng]
    };

    return link;
  }
}

function sanitizeCoordinates(latlng) {
  const coordinates = latlng
    .replace(/ /g, "")
    .split(",")
    .reverse()
    .map(c => parseFloat(c));

  if (!coordinates[0] || !coordinates[1]) {
    return null;
  }

  return coordinates;
}

// get panoramas <id>.jpg <id>a.jpg up to <id>z.jpg
function getPanoramas(nodeId) {
  const panoramas = [];

  let panLetter = "";
  for (let i = 0; i < 27; i++) {
    const fname = nodeId + panLetter + ".jpg";
    const fname_png = nodeId + panLetter + ".png";
    if (fs.existsSync(PANO_PATH + fname)) {
      panoramas.push(fname);
    } else if (fs.existsSync(PANO_PATH + fname_png)) {
      panoramas.push(fname_png);
    } else {
      break;
    }
    panLetter = String.fromCharCode(97 + i); // a through z
  }

  return panoramas;
}

function removeAbandoned(node) {
  return node && node.status !== "Abandoned" && node.status !== "Unsubscribe";
}

module.exports = getNodesAndLinks;
