const noteTitle = document.getElementById("note-title");
const noteText = document.getElementById("note-textarea");
const saveNote = document.getElementById("save-note");
const newNote = document.getElementById("new-note")
const listNote = document.getElementById("list-container list=group");

let currentNote = {};

// GET a list of existing notes from the server
const getNotes = () => {
    fetch ("api/notes", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
          },
    });
};

// POST new note to the page
const noteSave = (note) => {
    fetch ("/api/notes", {
        data: note,
        method: "POST",
        hearders
    });
};

const noteDelete = (id) => {
    return $.aja
}