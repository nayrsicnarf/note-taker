const express = require("express");
const path = require("path");
const fs = require("fs");
const uuid = require("uuid");

const app = express();
const PORT = process.env.PORT || 3000;

const Notes = JSON.parse(fs.readFileSync(path.join(__dirname, "/Develop/db/db.json")));

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("Develop/public"));

// GET request for index
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});

// Get request for notes
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});

// GET "*"" must be after GET notes or else it won't load notes.html when "Get Started" button is clicked
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});

app.get("api/notes", (req, res) => {
    return res.json(Notes);
});

app.post("api/notes", (req, res) => {
    let newNote = `{ "title": "${req.body.title}", "text": "${req.body.text}", "id": "${uuid.generate()}"}`;

    Notes.push(JSON.parse(newNote));

    fs.writeFile(path.join(__dirname, "./Develop/db/db.json"), JSON.stringify(Notes), err => {
        if (err) throw err;
    });
    return res.json(newNote);
});

app.delete("/api/notes/:id", (req, res) => {
    let index = 0;
    for (let i = 0; i < Notes.length; i++) {
        if (Notes[i].id === req.params.id) {
            index = 1;
        }
    }

    Notes.splice(index, 1);
    fs.writeFile(path.join(__dirname, "./Develop/db/db.json"), JSON.stringify(Notes), err => {
        if (err) throw err;
        res.end();
    });
});

app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});