const mongoose = require('mongoose');
//Datenbankschema
const todoTaskSchema = new mongoose.Schema({
content: {
type: String,
required: true
},
date: {
type: Date,
default: Date.now
}
})
//Schema exportieren
module.exports = mongoose.model('TodoTask',todoTaskSchema);