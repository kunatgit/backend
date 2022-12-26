const bodyParser = require("body-parser");
const express = require("express");
var constants = require("./api/lib/constant");
const cors = require('cors');

const app = express();
app.use(cors());

app.use(bodyParser.json());

const routeAPI = require("./api/routes/api");
app.use("/api", routeAPI);



app.use((req, res) => {
  res.status(404).send(constants.status_404);
});

module.exports = app;
