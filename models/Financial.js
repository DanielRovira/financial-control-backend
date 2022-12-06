const mongoose = require("mongoose")

const schema = mongoose.Schema({
	date: String,
	desc: String,
    amount: Number,
    expense: Boolean,
    prov: String,
    forn: String
})

module.exports = mongoose.model("Financial", schema, "financial-control-collection")