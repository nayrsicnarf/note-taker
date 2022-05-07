const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const notes = JSON.parse(fs.readFileSync(path.join(__dirname, "./Develop/db/db.json")));
//console.log(notes);

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

app.get("/api/notes", (req, res) => {
    //console.log(notes);
    return res.json(notes);
});

// POST request to save note(s)
app.post("/api/notes", (req, res) => {
    let newNote = `{ "title": "${req.body.title}", "text": "${req.body.text}" }`;

    notes.push(JSON.parse(newNote));

    fs.writeFile(path.join(__dirname, "./Develop/db/db.json"), JSON.stringify(notes), err => {
        if (err) throw err;
        console.log(newNote);
    });
    res.json(newNote);
});

// DELETE to handle the note delete
app.delete("/api/notes/:id", (req, res) => {
    let index = 0;
    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === req.params.id) {
            index = 1;
        }
    }

    notes.splice(index, 1);
    fs.writeFile(path.join(__dirname, "./Develop/db/db.json"), JSON.stringify(notes), err => {
        if (err) throw err;
        res.end();
    });
});

// GET "*"" must be at the end or else it won't load notes.html when "Get Started" button is clicked; this will also cause a syntax error
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});

// console logs the port being used (3000)
app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});