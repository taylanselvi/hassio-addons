const express = require("express");
const app = express();
const port = 8001;

app.get("/", (req, res) => {
  res.send("Hello from A2I2!");
});

app.listen(port, () => {
  console.log(`Hello A2I2 listening at http://localhost:${port}`);
});
