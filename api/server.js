const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("morgan"); //istek ve status bilgilerini konsolda gösterir.

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mainRoute = require("./routes/index.js");
app.use("/api", mainRoute);

app.use(logger("dev"));
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 5000;
app.listen(port, () => {
  // connect();
  console.log(`Example app listening on port ${port}`);
});
