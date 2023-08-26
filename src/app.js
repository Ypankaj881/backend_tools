require("dotenv").config();
const express = require("express");
const mergeRoutes = require("./routes/mergeRoutes");
const app = express();
const cors = require("cors");
app.use(cors());
const path = require("path");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.use(express.json());
app.use("/mergepdf", mergeRoutes);

module.exports = app;
