// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require("fs");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// (LOAD DATA)
// =============================================================
var noteData = require("./db/db.json"); //stores the notes
var idData = require("./db/id.json"); //stores the highest id number

// Routes
// =============================================================

//GET notes
app.get("/notes", function(req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//GET index.js asset file (we need this route, or site won't run)
app.get("/assets/js/index.js", function(req, res) {
  res.sendFile(path.join(__dirname, "public/assets/js/index.js"));
});
//GET styles.css asset file (we need this route, or site won't render properly)
app.get("/assets/css/styles.css", function(req, res) {
  res.sendFile(path.join(__dirname, "public/assets/css/styles.css"));
});

//GET api notes
app.get("/api/notes", function(req, res) {
  //Should read the db.json file and return all saved notes as JSON.
  return res.json(noteData);
});

//GET index (two versions: / and *)
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});
//note: this * one MUST be the LAST of the GET routes listed here, or else the program will shortcut to it.
//the * makes this a catch-all expression
app.get("*", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

//POST api notes
app.post("/api/notes", function(req, res) {
  //Should recieve a new note to save on the request body, add it to the db.json file, and then return the new note to the client.
  console.log("POST api note request"); //tests that we entered this route
  var temp_json = noteData; //create a temp copy of the current notes database
  var new_note = req.body; //copies req.body to make the new note

  new_note.id = idData[0].id; //assigns an id to the new note
  idData[0].id += 1; //increment the id counter
  fs.writeFileSync("./db/id.json", JSON.stringify(idData)); //save incremented id to database file

  temp_json.push(new_note); //push the new note onto our temp copy
  fs.writeFileSync("./db/db.json", JSON.stringify(temp_json)); //write our temp copy back into the notes database
  return res.json(req.body); //return new note to the client
});

//DELETE api note by id
app.delete("/api/notes/:id", function(req,res) {
  //Should recieve a query paramter containing the id of a note to delete. 
  //This means you'll need to find a way to give each note a unique id when it's saved. 
  //In order to delete a note, you'll need to:
  //1 - read all notes from the db.json file, 
  //2 - remove the note with the given id property
  //3- and then rewrite the notes to the db.json file.

  var temp_json = noteData; //create a temp copy of the current notes database
  for (var i = 0; i < temp_json.length; i++){ //look through all the notes
    if (temp_json[i].id == parseInt(req.params.id)){ //if the id matches the input id, we've found the note to delete
      temp_json.splice(i, 1); //deletes the note at the index we found
      fs.writeFileSync("./db/db.json", JSON.stringify(temp_json)); //write our temp copy back into the notes database
      return res.json(noteData); //return the notes db without the deleted note. (we need to return something to trigger the renderer)
    } 
  }
});

// Starts the server to begin listening
// =============================================================
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});


// // Displays all characters
// app.get("/api/characters", function(req, res) {
//   return res.json(characters);
// });

// // Displays a single character, or returns false
// app.get("/api/characters/:character", function(req, res) {
//   var chosen = req.params.character;

//   console.log(chosen);

//   for (var i = 0; i < characters.length; i++) {
//     if (chosen === characters[i].routeName) {
//       return res.json(characters[i]);
//     }
//   }

//   return res.json(false);
// });

// // Create New Characters - takes in JSON input
// app.post("/api/characters", function(req, res) {
//   // req.body hosts is equal to the JSON post sent from the user
//   // This works because of our body parsing middleware
//   var newCharacter = req.body;

//   // Using a RegEx Pattern to remove spaces from newCharacter
//   // You can read more about RegEx Patterns later https://www.regexbuddy.com/regex.html
//   newCharacter.routeName = newCharacter.name.replace(/\s+/g, "").toLowerCase();

//   console.log(newCharacter);

//   characters.push(newCharacter);

//   res.json(newCharacter);
// });


