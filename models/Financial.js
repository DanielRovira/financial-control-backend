const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const financialSchema = new Schema({
	date: String,
	desc: String,
    amount: Number,
    expense: Boolean,
    prov: String,
    forn: String
})

module.exports = mongoose.model("Financial", financialSchema, "financial-control-collection")