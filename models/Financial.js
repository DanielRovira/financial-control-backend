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

const sectionslSchema = new Schema({
    date: String
})

data.sections.map((section) => {

    module.exports[section.title] = mongoose.model(section.title, financialSchema, section.title)

})

module.exports.sections = mongoose.model("Sections", sectionslSchema, "sections")
