//Variabels deklarieren
//backend
const express = require("express");
const app = express();
//template
const dotenv = require("dotenv");
//database
const mongoose = require("mongoose");
//Schema importieren
const TodoTask = require("./models/TodoTask");
//File .env
dotenv.config();
//css
app.use("/static", express.static("public"));
//Daten von die Forme ins req.body
app.use(express.urlencoded({ extended: true }));
//Datenbank
mongoose.set("useFindAndModify", false);
//Datenbank verbinden; am Port anschließen
mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
    console.log("Die Datenbank ist verbunden");
    app.listen(3000, () => 
        console.log("Am Port 3000 anschließen"));
});
//HTML durch ejs
app.set("view engine", "ejs");
//Daten in der Datenbank einfügen
app.post('/', async (req, res) => {
    const todoTask = new TodoTask({
        content: req.body.content
    });
    try {
        await todoTask.save();
        res.redirect("/");
    } catch (err) {
        res.redirect("/");
    }
});
//HTML
app.get("/", (req, res) => {
    TodoTask.find({}, (err, tasks) => {
        res.render("todo.ejs", { todoTasks: tasks });
    });
});
//Daten aktualisieren
app
    .route("/edit/:id")
    .get((req, res) => {
        const id = req.params.id;
        TodoTask.find({}, (err, tasks) => {
            res.render("todoEdit.ejs", { todoTasks: tasks, idTask: id });
        });
    })
    //Aktuakisierung speichern
    .post((req, res) => {
        const id = req.params.id;
        TodoTask.findByIdAndUpdate(id, { content: req.body.content }, err => {
            if (err) return res.send(500, err);
            res.redirect("/");
        });
    });
//Daten löshen
app.route("/remove/:id").get((req, res) => {
    const id = req.params.id;
    TodoTask.findByIdAndRemove(id, err => {
        if (err) return res.send(500, err);
        res.redirect("/");
    });
});