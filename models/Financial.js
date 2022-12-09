const mongoose = require("mongoose")
var data = require('../config.json')

const Schema = mongoose.Schema;

const financialSchema = new Schema({
	date: String,
	desc: String,
    amount: Number,
    expense: Boolean,
    prov: String,
    forn: String
})

console.log("Sections:")
data.sections.map((section) => {
    // console.log(section.title)
    module.exports = mongoose.model(section.title, financialSchema, section.title)
})
// module.exports = mongoose.model("Financial", financialSchema, "financial-control-collection")