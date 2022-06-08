const express = require("express");
const cors = require("cors");
require("./utils/db");
const port = process.env.PORT || 2933;
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "This is start up point...!" });
});

app.listen(port, () => {
  console.log("server is now listening...!");
});
