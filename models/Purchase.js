const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const purchaseSchema = new Schema({
	date: String,
    costCenter: String,
    status: String,
    data: Object,
    desc: String,
    creator: String,
},
{
    versionKey: false // You should be aware of the outcome after set to false
}
)

// const Section = mongoose.model('Section', sectionSchema);
// const Category = mongoose.model('Category', sectionSchema);

module.exports = { purchaseSchema }

