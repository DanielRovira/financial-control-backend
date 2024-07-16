const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const financialSchema = new Schema({
	date: String,
    expense: Boolean,
    source: String,
    category: String,
    subCategory: String,
	link: String,
	bank: String,
	idnumber: String,
    provider: String,
	desc: String,
    amount: Number,
    costCenter: String,
    archived: Boolean,

    name: String,
    title: String,
    type: String,
},
{
    versionKey: false // You should be aware of the outcome after set to false
}
)

const sectionSchema = new Schema({
    name: String,
    title: String,
    type: String,
})

const Section = mongoose.model('Section', sectionSchema);
const Category = mongoose.model('Category', sectionSchema);

module.exports = { financialSchema, Section, Category  }

