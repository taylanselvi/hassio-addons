const Realm = require("realm");
const BSON = require("bson");

const APP_ID = "ua-smart-home-rdlqk";
const API_KEY =
  "Nxzpz0xv3l6tYH24zavb019KID00V0ElnQWklmWF3Gpyo5ctQkKh6qnJt5VQWX0S";
const COLLECTION_NAME = "event";
const PARTITION_VALUE = "node-partitioner";

const EventSchema = {
  name: COLLECTION_NAME,
  properties: {
    _id: "objectId",
    _partitionKey: "string?",
    name: "string",
    reporter: "string",
    status: "string",
    createdAt: "date",
  },
  primaryKey: "_id",
};

const app = new Realm.App({ id: APP_ID });
let realm;

async function realmLogin() {
  console.log("Logging in...");
  const credentials = Realm.Credentials.serverApiKey(API_KEY);
  await app.logIn(credentials);

  realm = await Realm.open({
    schema: [EventSchema],
    sync: {
      user: app.currentUser,
      partitionValue: PARTITION_VALUE,
    },
  });

  if (realm) console.log("Successfully logged in to MongoDB Realm.");
}

async function ingestEvent(name, reporter, status) {
  if (!realm) throw "Realm isn't present.";

  var date = new Date();
  date.setDate(date.getDate() + 2);

  const eventObject = {
    _id: new BSON.ObjectID(),
    name: name,
    reporter: reporter,
    status: status,
    createdAt: date,
  };

  realm.write(() => {
    realm.create(COLLECTION_NAME, eventObject);
  });

  return eventObject;
}

exports.realmLogin = realmLogin;
exports.ingestEvent = ingestEvent;
