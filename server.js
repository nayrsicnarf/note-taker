const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");
const { ppid } = require("process");

const app = express();
const PORT = process.env.PORT || 3000;

const notes = JSON.parse(fs.readFileSync(path.join(__dirname, ".Develop/db/db.json")));

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static("Develop/public"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});