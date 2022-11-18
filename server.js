require("dotenv").config();
const os = require("os");
const express = require("express");
const app = express();
const fs = require("fs");
const url = require("url");
const path = require("path");
const axios = require("axios");
const https = require("https");
const FormData = require("form-data");
const multer = require("multer");
const bodyParser = require("body-parser");
const { Readable } = require("stream");
const { Blob, resolveObjectURL } = require("node:buffer");

const router = express.Router();

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, { dir: `${os.tmpdir()}/uploads/` });
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: fileStorage });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.get("/", function (req, res) {
  res.render("home.ejs");
});

router.get("/upload", function (req, res) {
  res.render("upload.ejs");
});

router.get("/submit-audit", function (req, res) {
  res.render("submit-audit.ejs");
});

router.get("/withdraw", function (req, res) {
  res.render("withdraw.ejs");
});

router.get("/manifest", function (req, res) {
  res.sendFile(path.join(__dirname + "/manifest.json"));
});

router.get("/service-worker", function (req, res) {
  res.sendFile(path.join(__dirname + "/service-worker.js"));
});

if (process.env.NODE_ENV === "development") {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

if (process.env.NODE_ENV === "production") {
  app.use(express.errorHandler());
}

//add the router
app.use("/", router);
app.listen(process.env.port || 5000);

app.use(express.static(path.join(__dirname, "public")));
app.use("/service-worker.js", express.static(__dirname + "/service-worker.js"));
app.use("/manifest.json", express.static(__dirname + "/manifest.json"));
app.use(function (req, res, next) {
  res.status(404).render("not-found");
});
console.log("Running at Port 5000");
