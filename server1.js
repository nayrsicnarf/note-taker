// dependencies
const express = require("express");
const path = require("path");
const fs = require("fs");
// shortId for unique ids. reference: https://www.geeksforgeeks.org/node-js-npm-shortid-module/
const shortId = require("shortid");
// set up the Express app
const app = express();
const PORT = process.env.PORT || 3000;
// get the data from the db.json file. this is an array of objects
const allNotes = JSON.parse(fs.readFileSync(path.join(__dirname, "./Develop/db/db.json")));
// set up the Express app to handle data parsing
app.use(express.urlencoded({
    extended: true
}));
// parse incoming requests with JSON content
app.use(express.json());
// reference: https://expressjs.com/en/starter/static-files.html
app.use(express.static("Develop/public"));
// / GET route - index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});
// notes.html GET route
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/notes.html"));
});
// /api/notes GET route returns allNotes as JSON.
app.get("/api/notes", (req, res) => {
    return res.json(allNotes);
});
// * GET route - using * will direct everything else (other than /notes) to index.html
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./Develop/public/index.html"));
});
// /api/notes POST route - receives a new note to save to the db.json file. returns the new note to the client.
app.post("/api/notes", (req, res) => {
    let newNote = `{ "title": "${req.body.title}", "text":"${req.body.text}", "id": "${shortId.generate()}" }`;
    allNotes.push(JSON.parse(newNote));
    fs.writeFile(path.join(__dirname, "./Develop/db/db.json"), JSON.stringify(allNotes), err => {
        if (err) throw err;
    });
    return res.json(newNote);
});
// /api/notes/:id DELETE route - receives a query parameter containing the unique id of a note to delete (assigned in app.post route). reads all notes from the db.json file, removes the note with the given id, and then rewrites the remaining notes to the db.json file.
app.delete("/api/notes/:id", (req, res) => {
    let index = 0;
    for (let i = 0; i < allNotes.length; i++) {
        if (allNotes[i].id === req.params.id) {
            index = i;
        }
    }
    allNotes.splice(index, 1);
    fs.writeFile(path.join(__dirname, "./Develop/db/db.json"), JSON.stringify(allNotes), err => {
        if (err) throw err;
        res.end();
    });
});
// starts the server to begin listening
app.listen(PORT, () => {
    console.log("App listening on PORT " + PORT);
});