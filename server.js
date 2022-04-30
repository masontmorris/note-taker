const express = require("express");
const app = express();
const fs = require("fs");
const uuid = require("uuid");

const port = process.env.PORT || 3001;

var data = require("./db/db.json");

app.use(express.json());

app.get("/api/notes", function (req, res) {
    res.json(data);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/notes", (req, res) => {
    res.sendFile(__dirname + "/public/notes.html");
});

app.post("/api/notes", function (req, res) {
    var newNote = req.body;
    newNote.id = uuid.v4();
    data.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(data), function (err) {
        if (err) {
            console.log(err);
            res.status(500).end();
        } else {
            console.log(data);
            res.status(201).json(data);
        }
    });
});

app.delete("/api/notes", function (req, res) {
    var noteId = req.body.id;
    var noteIndex = data.findIndex((note) => note.id === noteId);
    data.splice(noteIndex, 1);
    fs.writeFile("./db/db.json", JSON.stringify(data), function (err) {
        if (err) console.log(err);
        else {
            console.log(data);
            res.status(200).json(data);
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}!`);
});
