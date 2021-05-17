const realmUtil = require("./realm-util");
const express = require("express");
const bodyParser = require("body-parser");
const basicAuth = require("express-basic-auth");
const expressApp = express();
const server = require("http").Server(expressApp);
const port = 3000;
const helmet = require("helmet");
const fs = require("fs");

// Load Home Assistant add-on options from standard location.
let options = {};
try {
  options = fs.readFileSync("/data/options.json", "utf8");
} catch (err) {
  console.error(err);
}

expressApp.use(helmet());
expressApp.use(bodyParser.json());
expressApp.use(bodyParser.urlencoded({ extended: true }));
expressApp.use(
  basicAuth({
    users: { [options.realmUsername]: `${options.realmPassword}` },
    challenge: true,
  })
);

realmUtil
  .realmLogin()
  .then(() => {
    expressApp.post("/ingest", (req, res) => {
      realmUtil
        .ingestEvent(req.body.name, req.body.reporter, req.body.status)
        .then((response) => {
          res.status(200);
          res.send(response);
          res.end();
        })
        .catch((error) => {
          console.log(error);
          res.status(500);
          res.send(error);
          res.end();
        });
    });

    server.listen(port, (err) => {
      if (err) {
        throw err;
      }

      console.log("Listening for requests...");
    });
  })
  .catch(() => {
    console.log("Error occurred when logging into MongoDB Realm.");
    process.exit(1);
  });
