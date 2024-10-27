const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const taskSchema = new Schema({
	title: String,
    completed: Boolean,
    desc: String,
    description: String,
})

module.exports = { taskSchema }

