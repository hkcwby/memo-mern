const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "Memos",
});

const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection made!");
});
const memoRouter = require("./memo-routes.js");
app.use("/memo", memoRouter);

app.listen(port, () => {
  console.log(`its alive! port:${port}`);
});
